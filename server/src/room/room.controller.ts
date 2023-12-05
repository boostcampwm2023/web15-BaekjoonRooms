import { Body, Controller, Logger, Post, Req } from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import User from '../entities/user.entity';

@Controller('room')
@ApiTags('room')
export class RoomController {
  private readonly logger = new Logger(RoomController.name);

  constructor(private readonly roomService: RoomService) {}

  // TODO: USER가 없을 경우도 처리
  @ApiResponse({
    status: 400,
    description: '이미 참가하고 있는 방이 있는데 방 생성을 시도한 경우',
  })
  @Post()
  @ApiOperation({
    summary: '방 생성',
  })
  async createRoom(@Req() req: Request) {
    const user: User = req.user as User;
    this.logger.debug(`user ${user.username} creating room...`);
    const room = await this.roomService.createRoom(user);
    this.logger.debug(`room: ${room.code} successfully created!!`);
    return { code: room.code };
  }

  @Post('join')
  async joinRoom(@Req() req: Request, @Body() body: { code: string }) {
    const user: User = req.user as User;
    const { code } = body;
    this.logger.debug(`user: ${user.username} joining room: ${code}`);
    return await this.roomService.addUserToRoom(user, code);
  }

  @Post('exit')
  async exitRoom(@Req() req: Request) {
    const user: User = req.user as User;
    this.logger.debug(`user ${user.username} exiting room...`);
    return await this.roomService.exitRoom(user);
  }
}
