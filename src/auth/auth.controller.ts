import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateuserDto } from 'src/user/dto/user/create-user.dto';
import { Message } from 'src/common/decorator/message.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/common/decorator/public.decorator';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { SigninDto } from 'src/user/dto/user/signin-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @Message('Successfully signup User')
  @Public()
  @ApiOperation({ summary: 'User sinup' })
  @Post('signup')
  registerUser(@Body() createUserDto: CreateuserDto) {
    return this.authServices.registerUser(createUserDto);
  }

  @Public()
  @Post('signin')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: SigninDto })
  @UseGuards(LocalAuthGuard)
  loginUser(@Request() req) {
    return this.authServices.login(req.user.id);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req) {
    return this.authServices.refreshToken(req.user.id);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/auth')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  googleCallBack(@Request() req) {
    return this.authServices.login(req.user.id);
  }

  @Post('signout')
  signOut(@Request() req) {
    return this.authServices.signOut(req.user.id);
  }
}
