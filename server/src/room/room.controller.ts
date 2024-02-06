import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import User from '../entities/user.entity';
import { SessionAuthGuard } from '../auth/auth.guard';
import { RoomUserService } from '../room-user/room-user.service';

@Controller('room')
@ApiTags('room')
@UseGuards(SessionAuthGuard)
export class RoomController {
  private readonly logger = new Logger(RoomController.name);

  constructor(
    private readonly roomService: RoomService,
    private readonly roomUserService: RoomUserService,
  ) {}

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
  @HttpCode(HttpStatus.OK)
  async joinRoom(@Req() req: Request, @Body() body: { code: string }) {
    const user: User = req.user as User;
    const { code } = body;
    this.logger.debug(`user: ${user.username} joining room: ${code}`);
    return await this.roomService.joinRoom(user, code);
  }

  @Post('exit')
  @HttpCode(HttpStatus.OK)
  async exitRoom(@Req() req: Request) {
    const user: User = req.user as User;
    this.logger.debug(`user ${user.username} exiting room...`);
    return await this.roomService.exitRoom(user);
  }

  @Get('/:code/ranking')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '방에 참가한 유저들의 랭킹 조회',
  })
  async getRoomRanking(@Param('code') code: string) {
    return this.roomService.getUsersRankingByRoomCode(code);
  }

  @ApiOperation({
    summary: '방에 참가한 유저들 조회',
  })
  @Get('/:code/users')
  @HttpCode(HttpStatus.OK)
  async getRoomUsers(@Param('code') code: string) {
    return await this.roomUserService.findUsersByRoomCode(code);
  }
}
