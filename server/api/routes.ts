import {FastifyInstance, FastifyPluginAsync, FastifyPluginOptions, FastifyReply, FastifyRequest,} from "fastify";
import {
    Client,
    getUpVoteStreamRequest,
    Message,
    postCommentRequest,
    postCommentSchema,
    postReplyCommentRequest,
    postReplyCommentSchema,
    postUpVoteCommentRequest
} from "./schemas";
import {serializeEvent} from "./helpers";
import Upvote from "../models/upvote";

let clients: Array<Client> = [];

const StreamRoutes: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
    fastify.get<getUpVoteStreamRequest>("/posts/:postId/upvotes", {}, streamUpVotes);

    function registerClient(client: Client) {
        clients.push(client);
    }

    function unregisterClient(client: Client) {
        console.log(`Unregistering ${client.id}`);
        clients = clients.filter((registeredClient) => registeredClient.id !== client.id);
    }

    function streamUpVotes(request: FastifyRequest<getUpVoteStreamRequest>, reply: FastifyReply) {
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };

        const message: Message = {
            event: 'open',
            retry: 100000,
            data: ''
        }

        reply.raw.writeHead(200, headers);
        reply.raw.write(serializeEvent(message));

        const client = {
            id: request.id,
            reply: reply,
            postId: Number(request.params.postId),
        };

        registerClient(client);
        request.raw.on('close', () => unregisterClient(client));
    }
}

const ApiRoutes: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
    // All APIs are under authentication
    fastify.addHook('preHandler', fastify.authPreHandler);
    fastify.post<postCommentRequest>('/posts/:postId/comments', {schema: postCommentSchema}, saveComment);
    fastify.post<postReplyCommentRequest>('/comments/:commentId/reply', {schema: postReplyCommentSchema}, replyComment);
    fastify.post<postUpVoteCommentRequest>('/comments/:commentId/upvote', {}, upVoteComment);


    function notifyUpVote(upvote: Upvote) {
        const postId = upvote.comment?.post_id;
        if (postId === undefined) {
            return;
        }

        const message: Message = {
            data: upvote,
        }

        const clientsToBeNotified = clients.filter((registeredClients) => registeredClients.postId === postId);
        clientsToBeNotified.forEach(client => {
            return client.reply.raw.write(serializeEvent(message));
        });
    }

    async function saveComment(request: FastifyRequest<postCommentRequest>, reply: FastifyReply) {
        const post = await fastify.postService.findById(request.params.postId);
        if (!post) {
            return reply.callNotFound();
        }

        const comment = await fastify.commentService.save({
            content: request.body.comment,
            post_id: request.params.postId,
            user_id: request.user?.id,
        });

        return reply.send(comment);
    }

    async function replyComment(request: FastifyRequest<postReplyCommentRequest>, reply: FastifyReply) {
        let comment = await fastify.commentService.findById(request.params.commentId);
        if (!comment) {
            return reply.callNotFound();
        }

        const commentReply = await fastify.commentService.save({
            content: request.body.comment,
            post_id: comment.post_id,
            comment_id: comment.id,
            user_id: request.session.user?.id,
        });

        return reply.send(commentReply);
    }

    async function upVoteComment(request: FastifyRequest<postUpVoteCommentRequest>, reply: FastifyReply) {
        let comment = await fastify.commentService.findById(request.params.commentId);
        if (!comment) {
            return reply.callNotFound();
        }

        // Eventually add a filter to prevent user to upvote more than once

        const upvote = await fastify.commentService.upvote({
            comment_id: request.params.commentId,
            user_id: request.user?.id,
        });

        reply.send(upvote);
        if (upvote instanceof Upvote) {
            notifyUpVote(upvote);
        }
    }
}


export {ApiRoutes, StreamRoutes};
