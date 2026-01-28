import { IsString, IsUUID } from 'class-validator';

export class CreateProfilePictureDto {
  @IsString()
  @IsUUID()
  userId: string;

  @IsString()
  imageUrl: string;
}

