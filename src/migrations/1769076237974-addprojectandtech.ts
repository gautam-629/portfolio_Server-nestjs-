import { MigrationInterface, QueryRunner } from "typeorm";

export class Addprojectandtech1769076237974 implements MigrationInterface {
    name = 'Addprojectandtech1769076237974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "image" character varying, "liveUrl" character varying, "githubUrl" character varying, "projectGoal" text, "projectOutCome" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "techs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, CONSTRAINT "PK_8ab2729ee26c5893090fb7b1b2b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_tech" ("projectsId" uuid NOT NULL, "techsId" uuid NOT NULL, CONSTRAINT "PK_37f088cba5d797e9490012a6eb4" PRIMARY KEY ("projectsId", "techsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_476d964bdc1ff668c344ff52c0" ON "project_tech" ("projectsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2f0efd6d39256af5f34fe8691d" ON "project_tech" ("techsId") `);
        await queryRunner.query(`ALTER TABLE "techs" ADD CONSTRAINT "FK_8cda7b6caef16ff298abb36c8a3" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_tech" ADD CONSTRAINT "FK_476d964bdc1ff668c344ff52c0f" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_tech" ADD CONSTRAINT "FK_2f0efd6d39256af5f34fe8691d6" FOREIGN KEY ("techsId") REFERENCES "techs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_tech" DROP CONSTRAINT "FK_2f0efd6d39256af5f34fe8691d6"`);
        await queryRunner.query(`ALTER TABLE "project_tech" DROP CONSTRAINT "FK_476d964bdc1ff668c344ff52c0f"`);
        await queryRunner.query(`ALTER TABLE "techs" DROP CONSTRAINT "FK_8cda7b6caef16ff298abb36c8a3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2f0efd6d39256af5f34fe8691d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_476d964bdc1ff668c344ff52c0"`);
        await queryRunner.query(`DROP TABLE "project_tech"`);
        await queryRunner.query(`DROP TABLE "techs"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
