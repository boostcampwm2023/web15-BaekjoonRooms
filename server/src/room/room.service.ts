import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import Room from 'src/entities/room.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import User from 'src/entities/user.entity';
import * as util from 'util';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly userService: UserService,
  ) {}

  async createRoom(userSession: User) {
    const { provider, providerId } = userSession;

    const user: User = await this.userService.findUserByProviderInfo({
      provider,
      providerId,
    });
    this.logger.debug('user from db:', util.inspect(user));
    if (!user) throw new BadRequestException('존재하지 않는 유저입니다.');
    if (user.joinedRooms)
      throw new BadRequestException('이미 방에 참가 중입니다.');

    const roomCode = await this.createRoomCode(user.username);

    return this.roomRepository
      .create({ code: roomCode, host: user, users: [user] })
      .save();
  }

  async createRoomCode(username: string) {
    const currentTime = Date.now();
    const hashSource = `${username}${currentTime}`;
    const hash = crypto.createHash('sha256').update(hashSource).digest('hex');
    return hash.substring(0, 6).toUpperCase();
  }
}
