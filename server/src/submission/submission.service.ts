import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as cheerio from 'cheerio';
import { BojResultsToStatus, Status } from '../const/boj-results';
import Submission from '../entities/submission.entity';
import { ProblemService } from '../problem/problem.service';
import { RoomService } from '../room/room.service';
import { RoomUserService } from '../room-user/room-user.service';
import { BojSubmissionInfo } from '../types/submission';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { SubmissionDto } from './dto/submission.dto';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class SubmissionService {
  private readonly logger = new Logger(SubmissionService.name);

  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
    private readonly userService: UserService,
    private readonly problemService: ProblemService,
    private readonly roomService: RoomService,
    private readonly roomUserService: RoomUserService,
    private readonly socketService: SocketService,
  ) {}

  async submitCode(submissionDto: SubmissionDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [bojUserId, bojProblemStringId, _] = submissionDto.submitURL
      .split('?')[1]
      .split('&')
      .map((v) => v.split('=')[1]);
    const submittedAt = new Date(); // extension으로 sumbit time을 받아서 판단하는 것이 더 정확한데 현재는 그냥 request가 들어오는 시간을 submittedAt으로 사용함
    this.logger.debug(bojUserId, bojProblemStringId);
    const bojProblemId = Number(bojProblemStringId);
    const { provider, providerId } = submissionDto;

    const user = await this.userService.findUserByProviderInfoWithRooms({
      provider,
      providerId,
    });
    if (!user) throw new BadRequestException('존재하지 않는 유저입니다.');

    const roomUsers = await user.joinedRooms;
    if (roomUsers == null || roomUsers.length === 0)
      throw new BadRequestException('참여중인 방이 없습니다.');

    const roomUser = roomUsers[0];
    const room = roomUser.room;
    const isStarted = room.isStarted;

    if (!isStarted) {
      throw new BadRequestException('아직 시작되지 않은 방입니다.');
    }

    const endAt = room.endAt;
    if (endAt == null || endAt < new Date()) {
      throw new BadRequestException('이미 종료된 방입니다.');
    }

    const problems = await room.problems;
    if (problems == null || problems.length === 0)
      throw new BadRequestException('문제가 없는 방입니다.');

    const problem =
      await this.problemService.getProblemByBojProblemId(bojProblemId);
    if (problem == null)
      throw new BadRequestException('존재하지 않는 문제입니다.');

    if (
      !problems.map((problem) => problem.bojProblemId).includes(bojProblemId)
    ) {
      throw new BadRequestException('참여중인 방에 없는 문제입니다.');
    }

    if (user.username == null)
      throw new BadRequestException('username이 없습니다.');

    await this.socketService.submitCode(
      user.username,
      room.code,
      bojProblemStringId,
    );

    const status: Status = await this.getBojSubmissionStatus({
      bojUserId,
      bojProblemStringId,
      submittedAt,
    });
    await this.socketService.notifySubmissionStatus(
      user.username,
      room.code,
      bojProblemStringId,
      status,
    );

    return await this.submissionRepository
      .create({
        status,
        user,
        room,
        problem,
        submittedAt,
      })
      .save();
  }

  // TODO : extension으로 sumbit time을 받지 않기에 현재는 제일 처음에 fetch 했을 때, 가장 위에 있는 row를 제출했던 것으로 간주함
  async getBojSubmissionStatus(bojSubmissionInfo: BojSubmissionInfo) {
    let status = Status.WAITING;
    let bojSolutionId: string = '';
    const { bojUserId, bojProblemStringId } = bojSubmissionInfo;
    const bojStatusUrl = `https://www.acmicpc.net//status?user_id=${bojUserId}&problem_id=${bojProblemStringId}`;

    while (status === Status.WAITING) {
      const statusPage = await fetch(bojStatusUrl).then((res) => res.text());
      const $ = cheerio.load(statusPage);
      const allSubmissions = $('tbody > tr');

      allSubmissions.each((index, element) => {
        const { tmpBojSolutionId, tmpStatus } = this.getEachSubmissionInfo(
          $,
          element,
        );

        if (bojSolutionId === '') {
          bojSolutionId = tmpBojSolutionId;
          status = BojResultsToStatus[tmpStatus];
          return false;
        }

        if (tmpBojSolutionId === bojSolutionId) {
          status = BojResultsToStatus[tmpStatus];
          return false;
        }
      });

      if (status === Status.WAITING) await this.sleep(500);
    }

    return status;
  }

  getEachSubmissionInfo(
    $: cheerio.CheerioAPI,
    submissionElement: cheerio.Element,
  ) {
    const tdElements = $(submissionElement).find('td');
    const tmpBojSolutionId = $(tdElements[0]).text();
    const tmpStatus = $(tdElements[3])
      .find('span')
      .attr('data-color') as string;

    return { tmpBojSolutionId, tmpStatus };
  }

  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 일단 미제출 문제에 대해서는 값을 리턴하지 않음
  async getRoomSubmission({ roomCode }) {
    const room = await this.roomService.findRoomByCode(roomCode);

    const subQuery = this.submissionRepository
      .createQueryBuilder(`latestSubmission`)
      .select('user_id')
      .addSelect('problem_id')
      .addSelect('MAX(submitted_at) as submitted_at')
      .groupBy('user_id, problem_id');

    const sumbissions = await this.submissionRepository
      .createQueryBuilder('submission')
      .where(`(user_id, problem_id, submitted_at) IN (${subQuery.getQuery()})`)
      .andWhere('room_id = :id', { id: room.id })
      .orderBy('user_id, problem_id')
      .leftJoinAndSelect('submission.user', 'user')
      .leftJoinAndSelect('submission.problem', 'problem')
      .getMany();

    return sumbissions.map((submission) => ({
      username: submission.user!.username,
      bojProblemId: submission.problem!.bojProblemId,
      status: submission.status,
    }));
  }
}
