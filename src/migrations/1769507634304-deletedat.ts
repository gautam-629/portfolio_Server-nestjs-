import { MigrationInterface, QueryRunner } from 'typeorm';

export class Deletedat1769507634304 implements MigrationInterface {
  name = 'Deletedat1769507634304';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "techs" ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "techs" DROP COLUMN "deletedAt"`);
  }
}
