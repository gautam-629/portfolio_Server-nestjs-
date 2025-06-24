import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateuserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userservice: UserService) {}

  async registerUser(createUserDto: CreateuserDto) {
    const user = await this.userservice.findByEmail(createUserDto.email);

    if (user) throw new ConflictException('User already Exists');

    return this.userservice.create(createUserDto);
  }

  async validateLocalUser(email: string, password: string) {

    const user = await this.userservice.findByEmail(email);


    if (!user) {
      throw new UnauthorizedException('User not Found!');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid Credentilals!');
    }

    return { id: user.id, role: user.role };
  }
}
