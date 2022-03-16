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
        const post =  await fastify.postService.findBySlug(request.params.slug);
        if  (!post) {
            return reply.callNotFound();
        }

        return post;
    }

    async function loginRandomUser(request: FastifyRequest, reply: FastifyReply) {
        request.session.user = await fastify.userService.getRandom();
    }

}


export default WebRoutes;
