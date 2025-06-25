import { Controller, HttpException, HttpStatus, Request , Post, UploadedFile } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfilePictureUpload } from 'src/common/decorator/file-upload.decorator';
import { CreateProfilePictureDto } from './dto/create-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  
   @Post('upload')
   @ProfilePictureUpload()
   async uploadProfilePicture(
      @Request() req,
      @UploadedFile() file:Express.Multer.File
   ){

    if(!file) throw new HttpException('File is required',HttpStatus.BAD_REQUEST)

      const createDto:CreateProfilePictureDto={
          userId:req.user.id,
          imageUrl:`/uploads/profile-pictures/${file.filename}`,
      }

      return await this.profileService.create(createDto)
    
   }
}
