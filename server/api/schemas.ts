import {FastifyReply} from "fastify";

const postCommentSchema = {
    body: {
        type: 'object',
        required: ['comment'],
        properties: {
            comment: {type: 'string', minLength: 1},
        }
    },
}

const postReplyCommentSchema = {
    body: {
        type: 'object',
        required: ['comment'],
        properties: {
            comment: {type: 'string', minLength: 1},
        }
    },
}

interface postCommentRequest {
    Body: {
        comment: string,
    },
    Params: {
        postId: number,
    }
}

interface postUpVoteCommentRequest {
    Params: {
        commentId: number,
    }
}

interface postReplyCommentRequest {
    Body: {
        comment: string,
    },
    Params: {
        commentId: number,
    }
}

interface getUpVoteStreamRequest {
    Params: {
        postId: number,
    }
}

interface Client {
    id: string,
    reply: FastifyReply,
    postId: number,
}

interface Message {
    id?: string,
    data?: Object,
    event?: string,
    retry?: number,
}

export {
    postCommentSchema,
    postCommentRequest,
    postUpVoteCommentRequest,
    postReplyCommentRequest,
    postReplyCommentSchema,
    getUpVoteStreamRequest,
    Client,
    Message,
}
