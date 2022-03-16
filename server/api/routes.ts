import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions, FastifyReply,
    FastifyRequest,
} from "fastify";
import {postCommentRequest, postCommentSchema, postUpVoteCommentRequest} from "./schemas";

const ApiRoutes: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {

    // All APIs are under authentication
    fastify.addHook('preHandler', fastify.authPreHandler);
    fastify.post<postCommentRequest>('/posts/:postId/comments', {schema: postCommentSchema}, saveComment);
    fastify.post<postUpVoteCommentRequest>('/comments/:commentId/upvote', {}, upVoteComment);

    async function saveComment(request: FastifyRequest<postCommentRequest>, reply: FastifyReply) {
        return reply.send("OK!");
    }

    async function upVoteComment(request: FastifyRequest<postUpVoteCommentRequest>, reply: FastifyReply) {
        return reply.send("OK!");
    }

}

export default ApiRoutes;
