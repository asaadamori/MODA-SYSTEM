import { MigrationInterface, QueryRunner } from "typeorm";

export class FixTBLReview1759331036880 implements MigrationInterface {
    name = 'FixTBLReview1759331036880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "ratings" integer NOT NULL, "comment" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "productId" integer, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "PK_f372d46eb70cd2a0cc36b25a012"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "PK_32e85bbbb964d1ff7aa42ed34be" PRIMARY KEY ("id", "description", "price", "stock", "images")`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "PK_32e85bbbb964d1ff7aa42ed34be"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "PK_772c9b1247620d706f8d59ddfad" PRIMARY KEY ("id", "price", "stock", "images")`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "PK_772c9b1247620d706f8d59ddfad"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "PK_d17c2c927ce6f259adf416235e1" PRIMARY KEY ("id", "stock", "images")`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "PK_d17c2c927ce6f259adf416235e1"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "PK_030115d9a8d02a8d9bf1b4c47db" PRIMARY KEY ("id", "images")`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "PK_030115d9a8d02a8d9bf1b4c47db"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_a6b3c434392f5d10ec171043666" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_a6b3c434392f5d10ec171043666"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "PK_030115d9a8d02a8d9bf1b4c47db" PRIMARY KEY ("id", "images")`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "PK_030115d9a8d02a8d9bf1b4c47db"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "PK_d17c2c927ce6f259adf416235e1" PRIMARY KEY ("id", "stock", "images")`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "PK_d17c2c927ce6f259adf416235e1"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "PK_772c9b1247620d706f8d59ddfad" PRIMARY KEY ("id", "price", "stock", "images")`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "PK_772c9b1247620d706f8d59ddfad"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "PK_32e85bbbb964d1ff7aa42ed34be" PRIMARY KEY ("id", "description", "price", "stock", "images")`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "PK_32e85bbbb964d1ff7aa42ed34be"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "PK_f372d46eb70cd2a0cc36b25a012" PRIMARY KEY ("id", "title", "description", "price", "stock", "images")`);
        await queryRunner.query(`DROP TABLE "reviews"`);
    }

}
