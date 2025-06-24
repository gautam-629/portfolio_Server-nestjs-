import { ConflictException, Injectable } from '@nestjs/common';
import { CreateuserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userservice: UserService) {}

  async registerUser(createUserDto: CreateuserDto) {
    const user = await this.userservice.findByEmail(createUserDto.email);

    if (user) throw new ConflictException('User already Exists');

    return this.userservice.create(createUserDto);
  }
}
