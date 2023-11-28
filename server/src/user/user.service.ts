import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/create.user.dto';
import { FindUserByProviderDto } from 'src/dtos/find.user.by,provider.dto';
import { Repository } from 'typeorm';
import User from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { provider, providerId } = createUserDto;
    const findUserByProviderDto = { provider, providerId };
    const user = await this.findUserByProviderInfo(findUserByProviderDto);

    if (user) throw new BadRequestException('이미 존재하는 유저입니다');
    return this.userRepository.create(createUserDto).save();
  }

  async findUserByProviderInfo(findUserByProviderDto: FindUserByProviderDto) {
    return this.userRepository.findOne({
      where: findUserByProviderDto,
    });
  }
}
