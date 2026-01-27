import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTechStackDto } from './dto/create-tech-stack.dto';
import { UpdateTechStackDto } from './dto/update-tech-stack.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TechStack } from './entities/tech-stack.entity';
import { CLSServiceImp } from 'src/common/local-storage/cls/cls.service';

@Injectable()
export class TechStackService {
  constructor(
    @InjectDataSource()
    private readonly datasource: DataSource,
    private readonly localStorageService: CLSServiceImp,
  ) {}
  async create(createTechStackDto: CreateTechStackDto): Promise<TechStack> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.query(
        `
          INSERT INTO techs ("title","description","createdBy") VALUES ($1,$2,$3)
          RETURNING * `,
        [
          createTechStackDto.title,
          createTechStackDto.description,
          this.localStorageService.getUser().id,
        ],
      );
      await queryRunner.commitTransaction();
      return result[0];
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code == '23505') {
        throw new HttpException(
          'Tech title already exists',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        `Failed to create tech:${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const techs = await queryRunner.query(
        `SELECT * from techs WHERE "deletedAt" IS NULL ORDER BY "createdAt" DESC`,
      );
      await queryRunner.commitTransaction();
      return techs;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        `Failed to fetch techs: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getOneForFalse(id: string) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.query(
        `SELECT * FROM techs WHERE id=$1 AND "deletedAt" IS NULL`,
        [id],
      );
      if (!result.length) {
        return false;
      } else {
        return result[0];
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error instanceof HttpException
        ? error
        : new HttpException(
            `Failed to fetch tech: ${error.message}`,
            HttpStatus.BAD_REQUEST,
          );
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: string) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.query(
        `SELECT * FROM techs WHERE id=$1 AND  "deletedAt" IS NUll `,
        [id],
      );
      if (!result.length) {
        throw new HttpException('Tech not found', HttpStatus.NOT_FOUND);
      }
      await queryRunner.commitTransaction();
      return result[0];
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error instanceof HttpException
        ? error
        : new HttpException(
            `Failed to fetch tech: ${error.message}`,
            HttpStatus.BAD_REQUEST,
          );
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, updateTechStackDto: Partial<UpdateTechStackDto>) {
    const tech = await this.getOneForFalse(id);
    if (!tech) {
      throw new HttpException('Tech not found', HttpStatus.NOT_FOUND);
    }
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.query(
        `
            UPDATE techs 
             SET
          "title" = COALESCE($1, "title"),
           "description" = COALESCE($2, "description"),
           "updatedAt" = NOW()
      WHERE id = $3
       AND "deletedAt" IS NULL
       RETURNING *
            `,
        [updateTechStackDto.title, updateTechStackDto.description, id],
      );
      if (!result.length) {
        throw new HttpException('Tech not found', HttpStatus.NOT_FOUND);
      }
      await queryRunner.commitTransaction();
      return result[0];
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === '23505') {
        throw new HttpException(
          'Tech title already exists',
          HttpStatus.CONFLICT,
        );
      }

      throw error instanceof HttpException
        ? error
        : new HttpException(
            `Failed to update tech: ${error.message}`,
            HttpStatus.BAD_REQUEST,
          );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const tech = await this.getOneForFalse(id);
      if (!tech) {
        throw new HttpException('Tech not found', HttpStatus.NOT_FOUND);
      }

      const result = await queryRunner.query(
        `UPDATE techs SET "deletedAt"=NOW() WHERE id=$1 AND "deletedAt" IS NULL RETURNING id`,
        [id],
      );
      if (!result.length) {
        throw new HttpException('Tech not found', HttpStatus.NOT_FOUND);
      }
      await queryRunner.commitTransaction();
      return result[0];
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error instanceof HttpException
        ? error
        : new HttpException(
            `Failed to delete tech: ${error.message}`,
            HttpStatus.BAD_REQUEST,
          );
    } finally {
      await queryRunner.release();
    }
  }
}
