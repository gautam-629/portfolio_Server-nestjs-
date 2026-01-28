import { TechStack } from '../../tech-stack/entities/tech-stack.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectPhotos } from './Project-photo.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  liveUrl: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  githubUrl: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  projectGoal: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  projectOutCome: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => TechStack, (tech) => tech.project)
  @JoinTable({
    name: 'project_tech',
  })
  techs: TechStack;

  @OneToMany(()=>ProjectPhotos,(photo)=>photo.project)
  photos:ProjectPhotos[]
}
