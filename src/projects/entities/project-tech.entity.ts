import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TechStack } from '../../tech-stack/entities/tech-stack.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('project_tech')
export class ProjectTech {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => TechStack)
  @JoinColumn({ name: 'techId' })
  tech: TechStack;
}
