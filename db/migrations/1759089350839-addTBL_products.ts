import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTBLProducts1759089350839 implements MigrationInterface {
    name = 'AddTBLProducts1759089350839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "price" numeric(10,2) NOT NULL DEFAULT '0', "stock" integer NOT NULL, "images" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "addedById" integer, "categoryId" integer, CONSTRAINT "PK_52094ba39f1bfa6a523eefd7416" PRIMARY KEY ("id", "title", "description", "price", "stock", "images"))`);
        await queryRunner.query(`ALTER TABLE "product_entity" ADD CONSTRAINT "FK_8b0d55381f493e07c428b104920" FOREIGN KEY ("addedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_entity" ADD CONSTRAINT "FK_641188cadea80dfe98d4c769ebf" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_entity" DROP CONSTRAINT "FK_641188cadea80dfe98d4c769ebf"`);
        await queryRunner.query(`ALTER TABLE "product_entity" DROP CONSTRAINT "FK_8b0d55381f493e07c428b104920"`);
        await queryRunner.query(`DROP TABLE "product_entity"`);
    }

}
