import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfilePictureDto } from './dto/create-profile.dto';
import { ProfilePicture } from './entity/profile.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ProfileDto } from './dto/profile-response.dto';
import { domain } from 'src/common/const';
import { use } from 'passport';
import * as path from 'path';
import * as fs from 'fs';
import { resourceUsage } from 'process';
import { UpdateProfilePictureDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreateProfilePictureDto): Promise<ProfilePicture> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      // ✅ Check if user exists
      const userExists = await queryRunner.query(
        'SELECT id FROM users WHERE id = ?',
        [createDto.userId],
      );

      if (!userExists.length) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // ✅ Insert profile picture
      await queryRunner.query(
        `INSERT INTO profile_pictures (imageUrl, uploadedAt, userId) VALUES (?, NOW(), ?)`,
        [createDto.imageUrl, createDto.userId],
      );

      // ✅ Get the most recently inserted record (optional: ORDER BY + LIMIT)
      const insertedRecord = await queryRunner.query(
        `SELECT pp.id, pp.imageUrl, u.id as userId, u.firstName, u.lastName, u.email
       FROM profile_pictures pp 
       LEFT JOIN users u ON pp.userId = u.id
       WHERE pp.userId = ?
       ORDER BY pp.uploadedAt DESC
       LIMIT 1`,
        [createDto.userId],
      );

      let result = insertedRecord[0];
      result.imageUrl = `${domain}/${result.imageUrl}`;

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        `Failed to create profile picture: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      const profile = await queryRunner.query(`
      SELECT pp.id, pp.imageUrl, u.email, u.firstName, u.lastName 
      FROM profile_pictures pp 
      LEFT JOIN users u ON pp.userId = u.id;
    `);

      await queryRunner.commitTransaction();

      return plainToInstance(ProfileDto, profile, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        `Failed to fetch profile, ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProfilePicture(userId: string, profileId: string) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      //find profile picture details
      const profilePicture = await queryRunner.query(
        `
      SELECT id,imageUrl from profile_pictures WHERE id=?
      `,
        [profileId],
      );

      if (!profilePicture.length) {
        throw new HttpException('Profile Not Found', HttpStatus.NOT_FOUND);
      }

      const deleteRecord = await queryRunner.query(
        `DELETE FROM profile_pictures WHERE id=?`,
        [profileId],
      );

      if (deleteRecord[0] === 0) {
        throw new HttpException(
          'Profile Picture not Found',
          HttpStatus.NOT_FOUND,
        );
      }

      console.log(profilePicture[0]);

      //delete the profile from filesystem
      if (profilePicture[0].imageUrl) {
        const filePath = path.join(
          `${process.cwd()}${profilePicture[0].imageUrl}`,
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await queryRunner.commitTransaction();

      return { userId: userId, profileId: profileId };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        `Failed to Delete Profile Picture ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
  async UpdateProfilePicture(
    userId: string,
    profileId: string,
    updateProfileDto: UpdateProfilePictureDto,
  ) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      //find profile
      const profilePicture = await queryRunner.query(
        `SELECT  id,imageUrl FROM profile_pictures WHERE id=? `,
        [profileId],
      );

      if (!profilePicture.length) {
        throw new HttpException(
          'ProfilePicture not found',
          HttpStatus.NOT_FOUND,
        );
      }

      //delelte old file
      if (profilePicture[0].imageUrl) {
        const filePath = path.join(
          `${process.cwd()}${profilePicture[0].imageUrl}`,
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      //update if found
      const updateProfilepicture = await queryRunner.query(
        `Update profile_pictures SET imageUrl=? WHERE id=? `,
        [updateProfileDto.imageUrl, profileId],
      );

      if (updateProfilepicture.affedtedRows === 0) {
        throw new HttpException(
          `Failed to update profile picture`,
          HttpStatus.BAD_REQUEST,
        );
      }

      await queryRunner.commitTransaction();

      return { profileId: profileId, userId: userId };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(
        `Failed to update profile picture: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
