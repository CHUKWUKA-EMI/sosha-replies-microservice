import {MigrationInterface, QueryRunner} from "typeorm";

export class repliesTable1653162082428 implements MigrationInterface {
    name = 'repliesTable1653162082428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "replies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reply" text NOT NULL, "userId" character varying NOT NULL, "userFirstName" character varying NOT NULL, "userLastName" character varying NOT NULL, "userName" character varying NOT NULL, "userImageUrl" character varying, "commentId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_08f619ebe431e27e9d206bea132" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "replies"`);
    }

}
