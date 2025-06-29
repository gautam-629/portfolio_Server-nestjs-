import { MigrationInterface, QueryRunner } from 'typeorm';

export class Removeuuid1751125492416 implements MigrationInterface {
  name = 'Removeuuid1751125492416';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`profile_pictures\` DROP FOREIGN KEY \`FK_980eb704bc96af9ee797c66dfc3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile_pictures\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile_pictures\` DROP COLUMN \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile_pictures\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile_pictures\` DROP COLUMN \`userId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile_pictures\` ADD \`userId\` int NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile_pictures\` ADD CONSTRAINT \`FK_980eb704bc96af9ee797c66dfc3\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`profile_pictures\` DROP FOREIGN KEY \`FK_980eb704bc96af9ee797c66dfc3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(
      `ALTER TABLE \`profile_pictures\` DROP COLUMN \`userId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile_pictures\` ADD \`userId\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile_pictures\` DROP COLUMN \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile_pictures\` ADD \`id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile_pictures\` ADD PRIMARY KEY (\`id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile_pictures\` ADD CONSTRAINT \`FK_980eb704bc96af9ee797c66dfc3\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
