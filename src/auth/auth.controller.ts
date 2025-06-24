import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateuserDto } from 'src/user/dto/create-user.dto';
import { Message } from 'src/common/decorator/message.decorator';
import { LocalAuthGuard } from './guards/local-auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @Message('Successfully created User')
  @Post('signup')
  registerUser(@Body() createUserDto: CreateuserDto) {
    return this.authServices.registerUser(createUserDto);
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  loginUser(@Request() req) {
    return this.authServices.login(req.user.id);
  }
}
