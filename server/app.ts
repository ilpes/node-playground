import knexConfig from "../knexfile";
import knex, {Knex} from "knex";
import {Model} from "objection";
import User from "./models/user";
import fp from "fastify-plugin";
import {
    FastifyError,
    FastifyInstance,
    FastifyPluginOptions,
    FastifyReply,
    FastifyRequest,
} from "fastify";
import WebRoutes from "./web/routes";
import UserService from "./services/user-service";
import PostService from "./services/post-service";
import {ApiRoutes, StreamRoutes} from "./api/routes";
import CommentService from "./services/comment-service";
import fastifyStatic from "fastify-static";
import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";
import path from "path";
import ejs from "ejs";
import pointOfView from "point-of-view";

declare module 'fastify' {
    export interface FastifyInstance {
        database: Knex;
        userService: UserService;
        postService: PostService;
        commentService: CommentService;
        authPreHandler(): void;
    }

    export interface FastifyRequest {
        user: User | undefined;
    }
}

const addServices = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    dayjs.extend(RelativeTime);

    const userService = new UserService();
    fastify.decorate('userService', userService);

    const postService = new PostService();
    fastify.decorate('postService', postService);

    const commentService = new CommentService();
    fastify.decorate('commentService', commentService);

    fastify.decorateRequest('user', undefined);
    fastify.decorate('authPreHandler', async function (request: FastifyRequest, reply: FastifyReply) {
        // Randomize user on every request
        const user = await fastify.userService.getRandom();
        if (user === undefined) {
            reply
                .code(401)
                .send(new Error('Unauthorized'));

            return;
        }
        // Decorate the request with a random user
        request.user = user;
    });
}

const connectToDatabase = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    const knexClient = knex(knexConfig[process.env.NODE_ENV || 'development']) as Knex<any, Record<string, any>[]>;
    Model.knex(knexClient);

    fastify.decorate('database', knexClient);
}


export default (fastify: FastifyInstance, options: FastifyPluginOptions, next: (error?: FastifyError) => void): void => {
    // Database and Services
    fastify.register(fp(connectToDatabase));
    fastify.register(fp(addServices));
    // APIs
    fastify.register(WebRoutes);
    fastify.register(ApiRoutes, {prefix: "/api"});
    fastify.register(StreamRoutes, {prefix: "/streams"});
    // Template Engine
    fastify.register(pointOfView, {
        engine:  {ejs: ejs},
        root: path.join(__dirname, "views"),
    });
    fastify.register(fastifyStatic, {
        root: path.join(__dirname, '../public'),
    });

    next();
}


