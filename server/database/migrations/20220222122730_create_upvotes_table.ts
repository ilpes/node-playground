import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('upvotes', (table) => {
        table.increments();
        table.integer('user_id').unsigned()
        table.integer('comment_id').unsigned()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.foreign('user_id').references('users.id');
        table.foreign('comment_id').references('comments.id');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('upvotes');
}

