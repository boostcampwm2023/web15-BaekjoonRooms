import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProblemModule } from './problem/problem.module';
import { RoomUserModule } from './room-user/room-user.module';
import { RoomModule } from './room/room.module';
import { ShortLoggerService } from './short-logger/short-logger.service';
import { SocketModule } from './socket/socket.module';
import { SubmissionModule } from './submission/submission.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOSTNAME,
      port: parseInt(process.env.DB_PORT ?? '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity.*'],
      logging: true,
      synchronize: true, // production시 false로 변경
      namingStrategy: new SnakeNamingStrategy(),
    }),
    AuthModule,
    UserModule,
    SocketModule,
    RoomModule,
    ProblemModule,
    SubmissionModule,
    RoomUserModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger, ShortLoggerService],
})
export class AppModule {
  constructor() {}
}
