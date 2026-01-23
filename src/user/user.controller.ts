import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Message } from 'src/common/decorator/message.decorator';
import { CreateuserDto } from './dto/user/create-user.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { RoleEnum } from 'src/common/enums/roles.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import {
  PaginationQueryDto,
  UserIdParamDto,
} from './dto/user/general-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Message('Successfully created User')
  @ApiOperation({ summary: 'Create Users' })
  @Public()
  @Post()
  async CreateuserDto(@Body() createUserDto: CreateuserDto) {
    return await this.userService.create(createUserDto);
  }

  @Public()
  @Get(':id')
  async getSingleUser(@Param() param: UserIdParamDto) {
    return this.userService.findById(param.id);
  }

  @Public()
  @Get()
  async getAll(@Query() query: PaginationQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    return this.userService.getAll(page, limit);
  }
}
