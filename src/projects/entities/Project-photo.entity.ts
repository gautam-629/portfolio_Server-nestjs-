import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('project_pictures')
export class ProjectPhotos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  imageUrl: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'ProjectId' })
  project: Project;
}
