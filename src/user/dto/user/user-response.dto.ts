import { Expose } from 'class-transformer';
import { RoleEnum } from 'src/common/enums/roles.enum';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  role: RoleEnum;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  refreshToken: string;
}
