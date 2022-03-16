import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions, FastifyReply,
    FastifyRequest,
} from "fastify";
import {GetPostRequest, getPostSchema} from './schemas';

const WebRoutes: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) =>  {

    fastify.get<GetPostRequest>('/:slug/', {schema: getPostSchema, preHandler: loginRandomUser}, getPost);

    async function getPost(request: FastifyRequest<GetPostRequest>, reply: FastifyReply) {
        return "Ok!";
    }

    async function loginRandomUser(request: FastifyRequest, reply: FastifyReply) {
    }
}


export default WebRoutes;
