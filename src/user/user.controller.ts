import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Message } from 'src/common/decorator/message.decorator';
import { CreateuserDto } from './dto/create-user.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RoleEnum } from 'src/common/enums/roles.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Message('Successfully created User')
  @Roles(RoleEnum.ADMIN,RoleEnum.MODERATOR)
  @Post()
  async CreateuserDto(@Body() createUserDto:CreateuserDto) {

  return await this.userService.create(createUserDto)

  }

  @Public()
  @Get(':id')
 async getSingleUser(@Param() param:{id:string}){
  console.log(param.id)
      return await this.userService.findById(param.id)
  }

  @Get()
  @Public()
  async getAll(){
    return this.userService.getAll()
  }

}
