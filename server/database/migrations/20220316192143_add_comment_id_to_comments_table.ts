import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('comments', (table) => {
        table.integer('comment_id').unsigned().nullable();
        table.foreign('comment_id').references('comments.id');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.table('comments', (table) => {
        table.dropColumn('comment_id');
    })
}

