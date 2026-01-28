import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { ProjectResponseDto } from './dto/project-response.dto';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}


 async getBytitle(title:string):Promise<boolean>{
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
     try {
      await queryRunner.startTransaction()
      const result= await queryRunner.query(
        `SELECT * FROM projects WHERE "title"=$1 AND "deletedAt" IS NULL`,[title]
      )
      if(result.length){
        return true
      }else{
      return false
      }
     } catch (error) {
       await queryRunner.commitTransaction()
       throw new HttpException(
        `Failed to create Project: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
     }finally{
      await queryRunner.release()
     }
  }

  async create(createProjectDto: CreateProjectDto):Promise<ProjectResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
    
      await queryRunner.startTransaction();
      const project = await queryRunner.query(
        `
            INSERT INTO projects 
            ("title","description","liveUrl","githubUrl","projectGoal","projectOutCome","createdAt")
            VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING *
          `,
        [
          createProjectDto.title,
          createProjectDto.description,
          createProjectDto.liveUrl,
          createProjectDto.githubUrl,
          createProjectDto.projectGoal,
          createProjectDto.projectOutCome,
        ],
      );

      const projectId = project[0].id;

      for (const techId of createProjectDto.techIds) {
        await queryRunner.query(
          `
              INSERT INTO project_tech ("projectId","techId") VALUES ($1,$2) RETURNING *
              `,
          [projectId, techId],
        );
      }

      let project_photo;
      for (const imageUrl of createProjectDto.images) {
        project_photo = await queryRunner.query(
          `INSERT INTO project_pictures ("imageUrl","ProjectId") VALUES ($1,$2) RETURNING *`,
          [imageUrl, projectId],
        );
      }

      const result = await queryRunner.query(`
      SELECT P.*,
        json_agg(
        json_build_object(
        'tech_id', t.id,
        'tech_name', t.title
      )
    ) as techStack,
     array_agg(pp."imageUrl") as projectPictures
     FROM projects P
    LEFT JOIN project_tech pt ON pt."projectId" = P.id
      LEFT JOIN techs t ON pt."techId" = t.id
    LEFT JOIN project_pictures pp ON pp."ProjectId"=p.id
    GROUP BY P.id;
`);
      await queryRunner.commitTransaction();

      const response=plainToInstance(
        ProjectResponseDto,
        result[0]
      )

      return response;
    } catch (error) {
    
      for (const image of createProjectDto.images) {
        const imagePath = path.join(process.cwd(), image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await queryRunner.rollbackTransaction();
      if (error.code === '23505') {
    await queryRunner.rollbackTransaction();
    throw new HttpException(
      'Project title already exists',
      HttpStatus.CONFLICT,
    );
  }
      throw new HttpException(
        `Failed to create Project: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
