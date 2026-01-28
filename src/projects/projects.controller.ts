import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Message } from 'src/common/decorator/message.decorator';
import { MultipleFileUpload } from 'src/common/decorator/file-upload.decorator';
import { ProjectUploadSchema } from './dto/general-dtos';
import { ProjectResponseDto } from './dto/project-response.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/general-dtos';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiTags('Projects')
  @ApiBearerAuth('access-token')
  @Message('Successfully created Project')
  @MultipleFileUpload()
  @ApiConsumes('multipart/form-data')
  @ApiBody(ProjectUploadSchema)
  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles() file: Express.Multer.File[],
  ): Promise<ProjectResponseDto> {
    const imageUrl = file.map((file) => `/uploads/projects/${file.filename}`);
    return this.projectsService.create({
      ...createProjectDto,
      images: imageUrl,
    });
  }

  @Get()
  @Public()
  findAll(@Query() query: PaginationQueryDto) {
    return this.projectsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
