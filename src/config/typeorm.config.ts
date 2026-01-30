import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ProfilePicture } from '../profile/entity/profile.entity';
import { TechStack } from '../tech-stack/entities/tech-stack.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectPhotos } from '../projects/entities/Project-photo.entity';
import { ProjectTech } from '../projects/entities/project-tech.entity';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),
    autoLoadEntities: true,
    synchronize: configService.get('NODE_ENV') === 'development',
    logging: configService.get('NODE_ENV') === 'development',
    ssl:false
  }),
};


export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_Pmeyb03AXuRK@ep-sparkling-flower-ahlgzvnl-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  entities: [
    User,
    ProfilePicture,
    TechStack,
    Project,
    ProjectPhotos,
    ProjectTech,
  ],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
 ssl:false
};


const dataSource = new DataSource(dataSourceOptions);

export default dataSource;