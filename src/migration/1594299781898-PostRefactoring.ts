import {MigrationInterface, QueryRunner,TableColumn} from "typeorm";

export class PostRefactoring1594299781898 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("task", new TableColumn({
            name: "teste",
            type: "varchar"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("task", "teste");
    }

}
