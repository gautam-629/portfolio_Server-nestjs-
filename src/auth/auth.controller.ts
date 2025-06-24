import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateuserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authServices:AuthService
    ){}

    @Post('signup')
    registerUser(@Body() createUserDto:CreateuserDto){
       return this.authServices.registerUser(createUserDto)
    } 
}
