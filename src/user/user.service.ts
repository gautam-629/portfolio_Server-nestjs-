import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateuserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';

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

  // Using QueryBuilder to insert a new user
  async create(createUserDto: CreateuserDto): Promise<User | null> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        ...userData,
        password: hashedPassword,
      })
      .execute();

    // Optionally fetch and return the newly created user
    return this.findByEmail(createUserDto.email);
  }
}
