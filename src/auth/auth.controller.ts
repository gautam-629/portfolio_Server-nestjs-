import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateuserDto } from 'src/user/dto/create-user.dto';
import { Message } from 'src/common/decorator/message.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/common/decorator/public.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @Message('Successfully created User')
  @Public()
  @Post('signup')
  registerUser(@Body() createUserDto: CreateuserDto) {
    return this.authServices.registerUser(createUserDto);
  }

  @Public()
  @Post('signin')
  @UseGuards(LocalAuthGuard)
  loginUser(@Request() req) {
    return this.authServices.login(req.user.id);
  }

  @Public()
   @UseGuards(RefreshAuthGuard)
   @Post('refresh')
   refreshToken(@Request() req){
     return this.authServices.refreshToken(req.user.id)
   }

   
}
