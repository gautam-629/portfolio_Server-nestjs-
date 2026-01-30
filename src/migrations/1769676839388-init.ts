import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1769676839388 implements MigrationInterface {
    name = 'Init1769676839388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile_pictures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "imageUrl" character varying NOT NULL, "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_55851331ec0d252521dd1f7cde2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user', 'moderator')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "refreshToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "techs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, CONSTRAINT "UQ_1ea8efcdda56c17fe5ae3d401a0" UNIQUE ("title"), CONSTRAINT "PK_8ab2729ee26c5893090fb7b1b2b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "liveUrl" character varying, "githubUrl" character varying, "projectGoal" text, "projectOutCome" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_2117ba29bd245f2b53c42f429c9" UNIQUE ("title"), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_pictures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "imageUrl" character varying(255) NOT NULL, "ProjectId" uuid, CONSTRAINT "PK_dffd265ad1bb1f83657137d5083" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_tech" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectId" uuid, "techId" uuid, CONSTRAINT "PK_8397eb90ebe7e481485296b4044" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" ADD CONSTRAINT "FK_980eb704bc96af9ee797c66dfc3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "techs" ADD CONSTRAINT "FK_8cda7b6caef16ff298abb36c8a3" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_pictures" ADD CONSTRAINT "FK_0b4716d4e8468701077af018119" FOREIGN KEY ("ProjectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_tech" ADD CONSTRAINT "FK_a85dad6639c9b8661d3d9a7b3d0" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_tech" ADD CONSTRAINT "FK_b0bbccbb7c9ef1a2ac50239de21" FOREIGN KEY ("techId") REFERENCES "techs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_tech" DROP CONSTRAINT "FK_b0bbccbb7c9ef1a2ac50239de21"`);
        await queryRunner.query(`ALTER TABLE "project_tech" DROP CONSTRAINT "FK_a85dad6639c9b8661d3d9a7b3d0"`);
        await queryRunner.query(`ALTER TABLE "project_pictures" DROP CONSTRAINT "FK_0b4716d4e8468701077af018119"`);
        await queryRunner.query(`ALTER TABLE "techs" DROP CONSTRAINT "FK_8cda7b6caef16ff298abb36c8a3"`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" DROP CONSTRAINT "FK_980eb704bc96af9ee797c66dfc3"`);
        await queryRunner.query(`DROP TABLE "project_tech"`);
        await queryRunner.query(`DROP TABLE "project_pictures"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "techs"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "profile_pictures"`);
    }

}
