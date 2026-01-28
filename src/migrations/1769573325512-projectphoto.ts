import { MigrationInterface, QueryRunner } from "typeorm";

export class Projectphoto1769573325512 implements MigrationInterface {
    name = 'Projectphoto1769573325512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_pictures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "imageUrl" character varying(255) NOT NULL, "projectId" uuid, CONSTRAINT "PK_dffd265ad1bb1f83657137d5083" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "project_pictures" ADD CONSTRAINT "FK_0d02130775cf8fe01d8a9ac7aea" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_pictures" DROP CONSTRAINT "FK_0d02130775cf8fe01d8a9ac7aea"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "image" character varying`);
        await queryRunner.query(`DROP TABLE "project_pictures"`);
    }

}
