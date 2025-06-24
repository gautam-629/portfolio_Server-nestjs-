import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class localStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {

    console.log('hello')
    
    if (!password){
      throw new UnauthorizedException('Please provide your password!');
    }
    return  await this.authService.validateLocalUser(email, password);

  }

}
