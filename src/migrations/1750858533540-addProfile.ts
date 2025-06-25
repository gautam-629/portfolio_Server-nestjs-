import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfile1750858533540 implements MigrationInterface {
    name = 'AddProfile1750858533540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`profile_pictures\` DROP FOREIGN KEY \`FK_980eb704bc96af9ee797c66dfc3\``);
        await queryRunner.query(`ALTER TABLE \`profile_pictures\` CHANGE \`userId\` \`userId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`profile_pictures\` ADD CONSTRAINT \`FK_980eb704bc96af9ee797c66dfc3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`profile_pictures\` DROP FOREIGN KEY \`FK_980eb704bc96af9ee797c66dfc3\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`profile_pictures\` CHANGE \`userId\` \`userId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`profile_pictures\` ADD CONSTRAINT \`FK_980eb704bc96af9ee797c66dfc3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
