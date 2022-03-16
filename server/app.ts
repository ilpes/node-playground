import knexConfig from "../knexfile";
import knex, {Knex} from "knex";
import {Model} from "objection";
import fp from "fastify-plugin";
import {
    FastifyError,
    FastifyInstance,
    FastifyPluginOptions,
} from "fastify";

declare module 'fastify' {
    export interface FastifyInstance {
        database: Knex;
    }
}

const connectToDatabase = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    const knexClient = knex(knexConfig[process.env.NODE_ENV || 'development']) as Knex<any, Record<string, any>[]>;
    Model.knex(knexClient);

    fastify.decorate('database', knexClient);
}


export default (fastify: FastifyInstance, options: FastifyPluginOptions, next: (error?: FastifyError) => void): void => {
    fastify.register(fp(connectToDatabase));

    next();
}


