import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { AuthJwtPayload } from 'src/common/types';
import { AuthService } from '../auth.service';
import { CLSServiceImp } from 'src/common/local-storage/cls/cls.service';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class JwtStragegy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly authService: AuthService,
    private readonly localStorage: CLSServiceImp,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret!,
      ignoreExpiration: false,
    });
  }

  async validate(payload: AuthJwtPayload) {
    const userId = payload.sub;

    const user = await this.authService.validateJwtUser(userId);

    this.localStorage.setUser(user as any);
    return user;
  }
}
