import {MigrationInterface, QueryRunner} from "typeorm";

export class addedIndex1653312261146 implements MigrationInterface {
    name = 'addedIndex1653312261146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_e2877ab282e45ccfd2b2d0fd20" ON "replies" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f3aaa45827962b1988ba2cf29" ON "replies" ("commentId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3f3aaa45827962b1988ba2cf29"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e2877ab282e45ccfd2b2d0fd20"`);
    }

}
