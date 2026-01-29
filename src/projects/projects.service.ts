import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { ProjectResponseDto } from './dto/project-response.dto';
import { plainToInstance } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/dto/general-dtos';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getBytitle(title: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const result = await queryRunner.query(
        `SELECT * FROM projects WHERE "title"=$1 AND "deletedAt" IS NULL`,
        [title],
      );
      if (result.length) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      await queryRunner.commitTransaction();
      throw new HttpException(
        `Failed to create Project: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async create(
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
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

      for (const imageUrl of createProjectDto.images) {
        await queryRunner.query(
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

      const response = plainToInstance(ProjectResponseDto, result[0]);

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

  async findAll(query: PaginationQueryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const page = query.page || 1;
      const limit = query.limit || 10;
      const offset = (page - 1) * limit;

      await queryRunner.startTransaction();
      const result = await queryRunner.query(
        `
       SELECT P.*,
       json_agg(
        json_build_object(
        'tech_id', t.id,
        'tech_name', t.title
      )
    ) as techStack,
      array_agg(pp."imageUrl") as projectPictures
       FROM projects p
       LEFT JOIN project_tech pt ON pt."projectId"=p.id
       LEFT JOIN techs t ON pt."techId"=t.id
       LEFT JOIN project_pictures pp ON pp."ProjectId"=p.id
       WHERE p."deletedAt" IS NULL
       GROUP BY p.id   
       ORDER BY "createdAt" DESC
       LIMIT $1 OFFSET $2
       ;
     `,
        [limit, offset],
      );
      const totalResult = await queryRunner.query(`
       SELECT COUNT(*) as TotalProject from projects
      `);
      const response = plainToInstance(ProjectResponseDto, result);
      const total = Number(totalResult[0].totalproject || 0);
      await queryRunner.commitTransaction();
      return {
        data: response,
        pagination: {
          total,
          page,
          limit,
          totalPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        `Failed to fetch Project ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const result = await queryRunner.query(
        `
        SELECT p.*,
        json_agg(
          json_build_object(
          'techId',t.id,
          'techName',t.title
          )
        ) as techStack,
         array_agg(pp."imageUrl") as Projectpictures
         FROM projects p 
         LEFT JOIN project_tech pt ON pt."projectId"=p.id
         LEFT JOIN techs t ON pt."techId"=t.id
         LEFT JOIN project_pictures pp ON pp."ProjectId"=p.id
         WHERE p.id=$1 AND p."deletedAt" IS NULL
         GROUP BY P.id
        `,
        [id],
      );
      if (!result.length) {
        throw new HttpException('Project Not Found', HttpStatus.NOT_FOUND);
      }
      await queryRunner.commitTransaction();
      console.log(result);
      return result[0];
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        `Failed to fetch Project ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      // Check if project exists
      const existingProject = await queryRunner.query(
        `SELECT * FROM projects WHERE id = $1`,
        [id],
      );

      if (!existingProject || existingProject.length === 0) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }

      // Build dynamic update query for project table
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramCounter = 1;

      if (updateProjectDto.title !== undefined) {
        updateFields.push(`"title" = $${paramCounter}`);
        updateValues.push(updateProjectDto.title);
        paramCounter++;
      }

      if (updateProjectDto.description !== undefined) {
        updateFields.push(`"description" = $${paramCounter}`);
        updateValues.push(updateProjectDto.description);
        paramCounter++;
      }

      if (updateProjectDto.liveUrl !== undefined) {
        updateFields.push(`"liveUrl" = $${paramCounter}`);
        updateValues.push(updateProjectDto.liveUrl);
        paramCounter++;
      }

      if (updateProjectDto.githubUrl !== undefined) {
        updateFields.push(`"githubUrl" = $${paramCounter}`);
        updateValues.push(updateProjectDto.githubUrl);
        paramCounter++;
      }

      if (updateProjectDto.projectGoal !== undefined) {
        updateFields.push(`"projectGoal" = $${paramCounter}`);
        updateValues.push(updateProjectDto.projectGoal);
        paramCounter++;
      }

      if (updateProjectDto.projectOutCome !== undefined) {
        updateFields.push(`"projectOutCome" = $${paramCounter}`);
        updateValues.push(updateProjectDto.projectOutCome);
        paramCounter++;
      }

      // Update project basic fields if there are any
      if (updateFields.length > 0) {
        updateValues.push(id);
        await queryRunner.query(
          `
        UPDATE projects 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCounter}
        `,
          updateValues,
        );
      }

      // Update techIds ONLY if explicitly provided
      if (updateProjectDto.techIds !== undefined) {
        if (updateProjectDto.techIds.length > 0) {
          // Delete existing tech associations
          await queryRunner.query(
            `DELETE FROM project_tech WHERE "projectId" = $1`,
            [id],
          );

          // Insert new tech associations
          for (const techId of updateProjectDto.techIds) {
            await queryRunner.query(
              `INSERT INTO project_tech ("projectId", "techId") VALUES ($1, $2)`,
              [id, techId],
            );
          }
        } else {
          // If empty array is provided, remove all tech associations
          await queryRunner.query(
            `DELETE FROM project_tech WHERE "projectId" = $1`,
            [id],
          );
        }
      }

      // Update images ONLY if explicitly provided
      if (updateProjectDto.images !== undefined) {
        if (updateProjectDto.images.length > 0) {
          // Get old images for cleanup
          const oldImages = await queryRunner.query(
            `SELECT "imageUrl" FROM project_pictures WHERE "ProjectId" = $1`,
            [id],
          );

          // Delete existing image records
          await queryRunner.query(
            `DELETE FROM project_pictures WHERE "ProjectId" = $1`,
            [id],
          );

          // Insert new images
          for (const imageUrl of updateProjectDto.images) {
            await queryRunner.query(
              `INSERT INTO project_pictures ("imageUrl", "ProjectId") VALUES ($1, $2)`,
              [imageUrl, id],
            );
          }

          // Clean up old image files from filesystem
          for (const oldImage of oldImages) {
            const imagePath = path.join(process.cwd(), oldImage.imageUrl);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          }
        } else {
          // If empty array is provided, remove all images
          const oldImages = await queryRunner.query(
            `SELECT "imageUrl" FROM project_pictures WHERE "ProjectId" = $1`,
            [id],
          );

          await queryRunner.query(
            `DELETE FROM project_pictures WHERE "ProjectId" = $1`,
            [id],
          );

          // Clean up image files
          for (const oldImage of oldImages) {
            const imagePath = path.join(process.cwd(), oldImage.imageUrl);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          }
        }
      }

      // Fetch updated project with all relations
      const result = await queryRunner.query(
        `
      SELECT P.*,
        json_agg(
          DISTINCT json_build_object(
            'tech_id', t.id,
            'tech_name', t.title
          )
        ) FILTER (WHERE t.id IS NOT NULL) as techStack,
        array_agg(DISTINCT pp."imageUrl") FILTER (WHERE pp."imageUrl" IS NOT NULL) as projectPictures
      FROM projects P
      LEFT JOIN project_tech pt ON pt."projectId" = P.id
      LEFT JOIN techs t ON pt."techId" = t.id
      LEFT JOIN project_pictures pp ON pp."ProjectId" = P.id
      WHERE P.id = $1
      GROUP BY P.id
      `,
        [id],
      );

      await queryRunner.commitTransaction();

      const response = plainToInstance(ProjectResponseDto, result[0]);
      return response;
    } catch (error) {
      // Cleanup newly uploaded images if update fails
      if (updateProjectDto.images && updateProjectDto.images.length > 0) {
        for (const image of updateProjectDto.images) {
          const imagePath = path.join(process.cwd(), image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      }

      await queryRunner.rollbackTransaction();

      if (error instanceof HttpException) {
        throw error;
      }

      if (error.code === '23505') {
        throw new HttpException(
          'Project title already exists',
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        `Failed to update project: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const result = queryRunner.query(
        `
        UPDATE projects 
        SET "deletedAt"=NOW() 
        WHERE id=$1 AND "delatedAt" IS NULL RETURNING id
        `,
        [id],
      );
      queryRunner.commitTransaction();
      return result[0];
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        `Failed to delte Project ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
