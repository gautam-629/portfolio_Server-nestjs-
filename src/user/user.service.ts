import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateuserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      excludeExtraneousValues: false,
    });
  }

  // Using QueryBuilder to insert a new user
  async create(createUserDto: CreateuserDto): Promise<UserResponseDto | null> {
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
}
