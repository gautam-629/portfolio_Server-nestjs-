import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateuserDto } from 'src/user/dto/user/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthJwtPayload } from 'src/common/types';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userservice: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async registerUser(createUserDto: CreateuserDto) {
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

  async login(userId: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);

    const hashRt = await hash(refreshToken);

    await this.userservice.updateHashedRefreshToken(userId, hashRt);

    const user = await this.userservice.findById(userId);

    return {
      user: {
        id: userId,
        firstName: user?.firstName,
        lastName: user?.lastName,
        role: user?.role,
        email: user?.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: string) {
    const payload: AuthJwtPayload = {
      sub: userId,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateJwtUser(userId: string) {
    const user = await this.userservice.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found!');
    }

    const currentUser = { id: user.id, role: user.role };

    return currentUser;
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userservice.findById(userId);

    if (!user) throw new UnauthorizedException('User not found');

    const refreshTokenMatch = await verify(user.refreshToken, refreshToken);

    if (!refreshTokenMatch)
      throw new UnauthorizedException('Invalid Refresh Token!');

    const currentUser = { id: user.id, role: user.role };

    return currentUser;
  }

  async refreshToken(userId: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);

    const hashRT = await hash(refreshToken);

    await this.userservice.updateHashedRefreshToken(userId, hashRT);

    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }

  async validateGoogleUser(googleUser: CreateuserDto) {
    const user = await this.userservice.findByEmail(googleUser.email);

    if (user) return user;

    return await this.userservice.create(googleUser);
  }

  async signOut(userId: string) {
    return await this.userservice.updateHashedRefreshToken(userId, null);
  }
}
