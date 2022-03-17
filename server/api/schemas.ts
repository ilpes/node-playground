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

export {postCommentSchema, postCommentRequest, postUpVoteCommentRequest, postReplyCommentRequest, postReplyCommentSchema}
