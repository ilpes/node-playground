import knexConfig from "../knexfile";
import knex, {Knex} from "knex";
import {Model} from "objection";
import fp from "fastify-plugin";
import {
    FastifyError,
    FastifyInstance,
    FastifyPluginOptions,
} from "fastify";
import WebRoutes from "./web/routes";
import UserService from "./services/user-service";
import fastifyCookie from "fastify-cookie";
import fastifySession from "@fastify/session";
import User from "./models/user";

declare module 'fastify' {
    export interface FastifyInstance {
        database: Knex;
        userService: UserService;
    }

    export interface Session {
        user: User | undefined;
    }
}

const addServices = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    const userService = new UserService();
    fastify.decorate('userService', userService);
}

const connectToDatabase = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    const knexClient = knex(knexConfig[process.env.NODE_ENV || 'development']) as Knex<any, Record<string, any>[]>;
    Model.knex(knexClient);

    fastify.decorate('database', knexClient);
}


export default (fastify: FastifyInstance, options: FastifyPluginOptions, next: (error?: FastifyError) => void): void => {
    // Cookies and Session
    fastify.register(fastifyCookie)
        .register(fastifySession, {
            secret: process.env.KEY || '',
            cookie: {
                secure: process.env.NODE_ENV === 'production',
            }
        });
    // Database and Services
    fastify.register(fp(connectToDatabase));
    fastify.register(fp(addServices));
    // APIs
    fastify.register(WebRoutes);

    next();
}


