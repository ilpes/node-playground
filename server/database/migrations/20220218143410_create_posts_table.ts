import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('posts', (table) => {
        table.increments();
        table.string('title').notNullable();
        table.string('content').notNullable();
        table.string('slug').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('posts');
}

