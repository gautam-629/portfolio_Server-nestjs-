import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAt1769512652578 implements MigrationInterface {
    name = 'UpdateAt1769512652578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "techs" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "techs" DROP COLUMN "updatedAt"`);
    }

}
