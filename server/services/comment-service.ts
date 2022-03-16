import Comment from "../models/comment";
import Upvote from "../models/upvote";

class CommentService {
    async save(data: object): Promise<Comment | undefined> {
        return Comment.query()
            .insert(data)
            .withGraphFetched('[user, upvotes, comments.[user, upvotes]]');
    }

    async findById(id: number): Promise<Comment | undefined> {
        return Comment.query()
            .select('*')
            .withGraphFetched('[user, upvotes, comments.[user, upvotes]]')
            .findById(id);
    }

    async upvote(data: object): Promise<Upvote | undefined> {
        return Upvote.query()
            .insert(data)
    }
}

export default CommentService;
