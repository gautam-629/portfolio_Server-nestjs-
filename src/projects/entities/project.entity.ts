import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
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

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
