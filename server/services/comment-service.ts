import Comment from "../models/comment";

class CommentService {
    async save(data: object): Promise<Comment | undefined> {
        return Comment.query()
            .insert(data)
            .withGraphFetched('[user, upvotes]');
    }
}

export default CommentService;
