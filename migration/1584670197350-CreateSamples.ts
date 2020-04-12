import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateSamples1584670197350 implements MigrationInterface {
    name = 'CreateSamples1584670197350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "samples" ("id" SERIAL NOT NULL, "sasage" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_d68b5b3bd25a6851b033fb63444" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "samples"`, undefined);
    }

}
