import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilePicture } from './entity/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfilePicture])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
