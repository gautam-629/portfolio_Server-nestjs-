import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

import { CreateProfilePictureDto } from './dto/create-profile.dto';
import { UpdateProfilePictureDto } from './dto/update-profile.dto';
import { ProfilePicture } from './entity/profile.entity';
import { domain } from 'src/common/const';

@Injectable()
export class ProfileService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createDto: CreateProfilePictureDto,
  ): Promise<ProfilePicture> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      // ✅ Check user exists
      const user = await queryRunner.query(
        `SELECT id FROM users WHERE id = $1`,
        [createDto.userId],
      );

      if (!user.length) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // ✅ Insert profile picture
      await queryRunner.query(
        `
        INSERT INTO profile_pictures ("imageUrl", "uploadedAt", "userId")
        VALUES ($1, NOW(), $2)
        `,
        [createDto.imageUrl, createDto.userId],
      );

      // ✅ Fetch latest uploaded picture
      const [profile] = await queryRunner.query(
        `
        SELECT
          pp.id,
          pp."imageUrl",
          pp."uploadedAt",
          u.id   AS "userId",
          u.email,
          u."firstName",
          u."lastName"
        FROM profile_pictures pp
        LEFT JOIN users u ON u.id = pp."userId"
        WHERE pp."userId" = $1
        ORDER BY pp."uploadedAt" DESC
        LIMIT 1
        `,
        [createDto.userId],
      );

      profile.imageUrl = `${domain}${profile.imageUrl}`;

      await queryRunner.commitTransaction();
      return profile;
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
      const profiles = await queryRunner.query(`
        SELECT
          pp.id,
          pp."imageUrl",
          pp."uploadedAt",
          u.email,
          u."firstName",
          u."lastName"
        FROM profile_pictures pp
        LEFT JOIN users u ON u.id = pp."userId"
        ORDER BY pp."uploadedAt" DESC
      `);

      return profiles.map((p) => ({
        ...p,
        imageUrl: `${domain}${p.imageUrl}`,
      }));
    } catch (error) {
      throw new HttpException(
        `Failed to fetch profiles: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProfilePicture(userId: string, profileId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      // ✅ Find profile
      const [profile] = await queryRunner.query(
        `SELECT id, "imageUrl" FROM profile_pictures WHERE id = $1`,
        [profileId],
      );

      if (!profile) {
        throw new HttpException(
          'Profile picture not found',
          HttpStatus.NOT_FOUND,
        );
      }

      // ✅ Delete DB record
      const result = await queryRunner.query(
        `DELETE FROM profile_pictures WHERE id = $1 RETURNING id`,
        [profileId],
      );

      if (!result.length) {
        throw new HttpException(
          'Failed to delete profile picture',
          HttpStatus.BAD_REQUEST,
        );
      }

      // ✅ Delete file from disk
      const filePath = path.join(process.cwd(), profile.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await queryRunner.commitTransaction();
      return { userId, profileId };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        `Failed to delete profile picture: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

 
  async updateProfilePicture(
    userId: string,
    profileId: string,
    updateDto: UpdateProfilePictureDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      // ✅ Find existing profile
      const [profile] = await queryRunner.query(
        `SELECT id, "imageUrl" FROM profile_pictures WHERE id = $1`,
        [profileId],
      );

      if (!profile) {
        throw new HttpException(
          'Profile picture not found',
          HttpStatus.NOT_FOUND,
        );
      }

      // ✅ Delete old file
      const oldPath = path.join(process.cwd(), profile.imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      // ✅ Update record
      const updated = await queryRunner.query(
        `
        UPDATE profile_pictures
        SET "imageUrl" = $1
        WHERE id = $2
        RETURNING id
        `,
        [updateDto.imageUrl, profileId],
      );

      if (!updated.length) {
        throw new HttpException(
          'Failed to update profile picture',
          HttpStatus.BAD_REQUEST,
        );
      }

      await queryRunner.commitTransaction();
      return { userId, profileId };
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
