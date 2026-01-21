import { MigrationInterface, QueryRunner } from "typeorm";

export class Uuid1768992054132 implements MigrationInterface {
    name = 'Uuid1768992054132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_pictures" DROP CONSTRAINT "FK_980eb704bc96af9ee797c66dfc3"`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" DROP CONSTRAINT "PK_55851331ec0d252521dd1f7cde2"`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" ADD CONSTRAINT "PK_55851331ec0d252521dd1f7cde2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" ADD CONSTRAINT "FK_980eb704bc96af9ee797c66dfc3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_pictures" DROP CONSTRAINT "FK_980eb704bc96af9ee797c66dfc3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" DROP CONSTRAINT "PK_55851331ec0d252521dd1f7cde2"`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" ADD CONSTRAINT "PK_55851331ec0d252521dd1f7cde2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "profile_pictures" ADD CONSTRAINT "FK_980eb704bc96af9ee797c66dfc3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
