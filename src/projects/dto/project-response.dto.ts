import { Expose, Transform, Type } from 'class-transformer';
import { domain } from 'src/common/const';

export class ProjectTechResponseDto {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'title' })
  title: string;
}

export class ProjectResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  liveUrl: string | null;

  @Expose()
  githubUrl: string | null;

  @Expose()
  projectGoal: string | null;

  @Expose()
  projectOutCome: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date | null;

  @Expose()
  @Type(() => ProjectTechResponseDto)
  techstack: ProjectTechResponseDto[];

  @Expose()
  @Transform(({ value }) =>
    (value ?? []).map((path: string) =>
      path.startsWith('http') ? path : `${domain}${path}`,
    ),
  )
  projectpictures: string[];
}
