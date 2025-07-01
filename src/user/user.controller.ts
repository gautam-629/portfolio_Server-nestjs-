import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Message } from 'src/common/decorator/message.decorator';
import { CreateuserDto } from './dto/create-user.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { RoleEnum } from 'src/common/enums/roles.enum';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Message('Successfully created User')
  @Roles(RoleEnum.ADMIN, RoleEnum.MODERATOR)
  @Post()
  async CreateuserDto(@Body() createUserDto: CreateuserDto) {
    return await this.userService.create(createUserDto);
  }

  @Public()
  @Get(':id')
  async getSingleUser(@Param() param: { id: string }) {
    console.log(param.id);
    return await this.userService.findById(param.id);
  }

  @Get()
  @Public()
  async getAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.userService.getAll(Number(page) || 1, Number(limit) || 10);
  }
}
