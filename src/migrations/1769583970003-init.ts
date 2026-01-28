import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1769583970003 implements MigrationInterface {
  name = 'Init1769583970003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_tech" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectId" uuid, "techId" uuid, CONSTRAINT "PK_8397eb90ebe7e481485296b4044" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_tech" ADD CONSTRAINT "FK_a85dad6639c9b8661d3d9a7b3d0" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_tech" ADD CONSTRAINT "FK_b0bbccbb7c9ef1a2ac50239de21" FOREIGN KEY ("techId") REFERENCES "techs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_tech" DROP CONSTRAINT "FK_b0bbccbb7c9ef1a2ac50239de21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_tech" DROP CONSTRAINT "FK_a85dad6639c9b8661d3d9a7b3d0"`,
    );
    await queryRunner.query(`DROP TABLE "project_tech"`);
  }
}
