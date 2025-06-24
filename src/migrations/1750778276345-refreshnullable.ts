import { MigrationInterface, QueryRunner } from 'typeorm';

export class Refreshnullable1750778276345 implements MigrationInterface {
  name = 'Refreshnullable1750778276345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NOT NULL`,
    );
  }
}
