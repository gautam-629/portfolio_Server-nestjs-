import { Project } from '../../projects/entities/project.entity';
import { User } from '../../user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('techs')
export class TechStack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 100,
    type: 'varchar',
    unique: true,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'createdBy',
  })
  createdBy: User;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt:Date;

  @ManyToMany(() => Project, (project) => project.techs)
  project: Project[];
}
