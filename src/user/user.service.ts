import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateuserDto } from './dto/user/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  // Using QueryBuilder to find a user by email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne(); // Use getOne to return the first match
  }

  async findById(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) return null;

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // Using QueryBuilder to insert a new user
  async create(createUserDto: CreateuserDto): Promise<UserResponseDto | null> {
    const user = await this.findByEmail(createUserDto.email);

    if (user) throw new ConflictException('User already Exists');

    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        ...userData,
        password: hashedPassword,
      })
      .execute();

    const insertUseId = insertResult.identifiers[0]?.id;

    return this.findById(insertUseId);
  }

  async updateHashedRefreshToken(userid: string, hashedRT: string | null) {
    return await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ refreshToken: hashedRT })
      .where('id = :id', { id: userid })
      .execute();
  }

  async getAll(page: number, limit: number) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      const offset = (page - 1) * limit;

      // PostgreSQL uses $1, $2 for parameterized queries
      const users = await queryRunner.query(
        `SELECT * FROM users LIMIT $1 OFFSET $2`,
        [limit, offset],
      );

      const totalResult = await queryRunner.query(
        `SELECT COUNT(*) AS count FROM users`,
      );
      const total = Number(totalResult[0].count || 0);

      await queryRunner.commitTransaction();

      return {
        result: plainToInstance(UserResponseDto, users, {
          excludeExtraneousValues: true,
        }),
        page,
        total,
        limit,
        totalPage: Math.ceil(total / limit),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        `Failed to fetch users: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
