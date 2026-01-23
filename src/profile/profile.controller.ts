import {
  Controller,
  HttpException,
  HttpStatus,
  Request,
  Post,
  UploadedFile,
  Get,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfilePictureUpload } from 'src/common/decorator/file-upload.decorator';
import {
  CreateProfilePictureDto,
  ProfilePictureUploadSchema,
} from './dto/create-profile.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { Message } from 'src/common/decorator/message.decorator';
import { UpdateProfilePictureDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { profileIdParamDto } from './dto/general-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiTags('Profile')
  @ApiBearerAuth('access-token')
  @Message('Successfully created Profile')
  @Post('upload')
  @ProfilePictureUpload()
  @ApiConsumes('multipart/form-data')
  @ApiBody(ProfilePictureUploadSchema)
  async uploadProfilePicture(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file)
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);

    const createDto: CreateProfilePictureDto = {
      userId: req.user.id,
      imageUrl: `/uploads/profile-pictures/${file.filename}`,
    };

    return await this.profileService.create(createDto);
  }
  @Public()
  @Get()
  async findAll() {
    return await this.profileService.findAll();
  }

  @Message('Successfully deleted Profile Picture')
  @ApiBearerAuth('access-token')
  @Delete(':id')
  async deleteProfilePicture(
    @Request() req,
    @Param() params: profileIdParamDto,
  ) {
    return await this.profileService.deleteProfilePicture(
      req.user.id,
      params.id,
    );
  }

  @Message('Successfully  updated Profile Picture')
  @ApiBearerAuth('access-token')
  @Patch(':id')
  @ProfilePictureUpload()
  @ApiConsumes('multipart/form-data')
  @ApiBody(ProfilePictureUploadSchema)
  async UpdateProfilePicture(
    @Request() req,
    @Param() params: profileIdParamDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException(`File Not Found`, HttpStatus.NOT_FOUND);
    }

    const updateProfileDto: UpdateProfilePictureDto = {
      imageUrl: `/uploads/profile-pictures/${file.filename}`,
    };

    return await this.profileService.updateProfilePicture(
      req.user.id,
      params.id,
      updateProfileDto,
    );
  }
}
