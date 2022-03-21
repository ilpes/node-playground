import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions, FastifyReply,
    FastifyRequest,
} from "fastify";
import {GetPostRequest, getPostSchema} from './schemas';

const WebRoutes: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) =>  {

    fastify.addHook('preHandler', fastify.authPreHandler);
    fastify.get<GetPostRequest>('/:slug', {schema: getPostSchema}, getPost);

    async function getPost(request: FastifyRequest<GetPostRequest>, reply: FastifyReply) {
        const post =  await fastify.postService.findBySlug(request.params.slug);
        if  (!post) {
            return reply.callNotFound();
        }

        return reply.view('post.ejs', {
            post: post.toJSON(),
            user: request.user?.toJSON()
        });
    }

}


export default WebRoutes;
