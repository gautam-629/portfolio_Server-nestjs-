import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class CLSServiceImp {
  constructor(private readonly clsService: ClsService) {}
  setUser(value: User): void {
    this.clsService.set('user', value);
  }
  getUser(): User {
    return this.clsService.get('user');
  }
}
