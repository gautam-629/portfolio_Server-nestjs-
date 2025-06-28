import { Controller, HttpException, HttpStatus, Request , Post, UploadedFile, Get, Req, Delete, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfilePictureUpload } from 'src/common/decorator/file-upload.decorator';
import { CreateProfilePictureDto } from './dto/create-profile.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { Message } from 'src/common/decorator/message.decorator';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  
  @Message('Successfully created Profile')
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
   @Public()
   @Get()
   async findAll(){
        return await this.profileService.findAll();
   }
 
 @Message('Successfully deleted Profile Picture')
  @Delete(":id")
  async deleteProfilePicture(
   @Request() req,
   @Param() params:{id:string}
){

   return await this.profileService.deleteProfilePicture(req.user.id,params.id)

  }


 
   
}
