import { IsString, IsUUID } from 'class-validator';

export class CreateProfilePictureDto {
  @IsString()
  @IsUUID()
  userId: string;

  @IsString()
  imageUrl: string;
}

export const ProfilePictureUploadSchema = {
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
    required: ['file'],
  },
};
