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

  findAll() {
    return `This action returns all techStack`;
  }

  findOne(id: number) {
    return `This action returns a #${id} techStack`;
  }

  update(id: number, updateTechStackDto: UpdateTechStackDto) {
    return `This action updates a #${id} techStack`;
  }

  remove(id: number) {
    return `This action removes a #${id} techStack`;
  }
}
