import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TechStackService } from './tech-stack.service';
import { CreateTechStackDto } from './dto/create-tech-stack.dto';
import { UpdateTechStackDto } from './dto/update-tech-stack.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RoleEnum } from 'src/common/enums/roles.enum';
import { Message } from 'src/common/decorator/message.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import { TechIdPramDto } from './dto/general-tech-stack.dto';

@Controller('tech-stack')
export class TechStackController {
  constructor(private readonly techStackService: TechStackService) {}

  @Message('Successfully created TechStack')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create Tech Stack' })
  @Roles(RoleEnum.ADMIN)
  @Post()
  create(@Body() createTechStackDto: CreateTechStackDto) {
    return this.techStackService.create(createTechStackDto);
  }

  @Public()
  @ApiOperation({ summary: 'Tech List' })
  @Message('Tech List')
  @Get()
  findAll() {
    return this.techStackService.findAll();
  }

  @Message('Tech Details')
  @ApiOperation({ summary: 'Tech details' })
  @Public()
  @Get(':id')
  findOne(@Param() parms: TechIdPramDto) {
    return this.techStackService.findOne(parms?.id);
  }

  @Message('Successfully updated TechStack')
  @ApiOperation({ summary: 'Update Tech Stack' })
  @ApiBearerAuth('access-token')
  @Patch(':id')
  update(
    @Param() params: TechIdPramDto,
    @Body() updateTechStackDto: UpdateTechStackDto,
  ) {
    return this.techStackService.update(params.id, updateTechStackDto);
  }

  @Message('Successfully deleted TechStack')
  @ApiOperation({ summary: 'Delete Tech Stack' })
  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param() params: TechIdPramDto) {
    return this.techStackService.remove(params.id);
  }
}
