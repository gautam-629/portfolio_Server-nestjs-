import {  HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfilePictureDto } from './dto/create-profile.dto';
import { ProfilePicture } from './entity/profile.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ProfileService {

    constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) {}

  async create(createDto: CreateProfilePictureDto): Promise<ProfilePicture> {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    await queryRunner.startTransaction();


    // ✅ Check if user exists
    const userExists = await queryRunner.query(
      'SELECT id FROM users WHERE id = ?',
      [createDto.userId]
    );

    if (!userExists.length) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // ✅ Insert profile picture
    await queryRunner.query(
      `INSERT INTO profile_pictures (imageUrl, uploadedAt, userId) VALUES (?, NOW(), ?)`,
      [createDto.imageUrl, createDto.userId]
    );

    // ✅ Get the most recently inserted record (optional: ORDER BY + LIMIT)
    const insertedRecord = await queryRunner.query(
      `SELECT pp.id, pp.imageUrl, u.id as userId, u.firstName, u.lastName, u.email
       FROM profile_pictures pp 
       LEFT JOIN users u ON pp.userId = u.id
       WHERE pp.userId = ?
       ORDER BY pp.uploadedAt DESC
       LIMIT 1`,
      [createDto.userId]
    );

    let result=insertedRecord[0];
    result.imageUrl = `${domain}/${result.imageUrl}`

    await queryRunner.commitTransaction();
    
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new HttpException(
      `Failed to create profile picture: ${error.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  } finally {
    await queryRunner.release();
  }
}

}
