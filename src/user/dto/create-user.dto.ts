import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enums/roles.enum';

export class CreateuserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

   @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
