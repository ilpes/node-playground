import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions,
    FastifyReply,
    FastifyRequest,
} from "fastify";
import {postCommentRequest, postCommentSchema, postUpVoteCommentRequest} from "./schemas";

const ApiRoutes: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {

    // All APIs are under authentication
    fastify.addHook('preHandler', fastify.authPreHandler);
    fastify.post<postCommentRequest>('/posts/:postId/comments', {schema: postCommentSchema}, saveComment);
    fastify.post<postUpVoteCommentRequest>('/comments/:commentId/upvote', {}, upVoteComment);

    async function saveComment(request: FastifyRequest<postCommentRequest>, reply: FastifyReply) {
        const post =  await fastify.postService.findById(request.params.postId);
        if  (!post) {
            return reply.callNotFound();
        }

        const comment = await fastify.commentService.save({
            content: request.body.comment,
            post_id: request.params.postId,
            user_id: request.session.user?.id,
        });

        return reply.send(comment);
    }

    async function upVoteComment(request: FastifyRequest<postUpVoteCommentRequest>, reply: FastifyReply) {
        let comment =  await fastify.commentService.findById(request.params.commentId);
        if  (!comment) {
            return reply.callNotFound();
        }

        // Eventually add a filter to prevent user to upvote more than once

        const upvote = await fastify.commentService.upvote({
            comment_id: request.params.commentId,
            user_id: request.session.user?.id,
        });

        // Reload comment
        comment = await fastify.commentService.findById(request.params.commentId);

        return reply.send(comment);
    }

}

export default ApiRoutes;
