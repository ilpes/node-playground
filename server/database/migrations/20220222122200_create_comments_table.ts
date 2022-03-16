import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('comments', (table) => {
        table.increments();
        table.integer('user_id').unsigned()
        table.integer('post_id').unsigned()
        table.text('content');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.foreign('user_id').references('users.id');
        table.foreign('post_id').references('posts.id');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('comments');
}

