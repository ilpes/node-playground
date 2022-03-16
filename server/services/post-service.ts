import Post from "../models/post";

class PostService {

    async findBySlug(slug: string): Promise<Post | undefined> {
        return Post.query()
            .withGraphFetched('comments.[user, upvotes, comments.[user, upvotes]]')
            .modifyGraph('comments', builder => {
                builder
                    .whereNull('comment_id')
                    .orderBy('id', 'DESC');
            })
            .modifyGraph('comments.comments', builder => {
                builder
                    .orderBy('id', 'DESC')
            })
            .select('*')
            .where({
                slug: slug
            })
            .first();
    }

    async findById(id: number): Promise<Post | undefined> {
        return Post.query()
            .select('*')
            .findById(id);
    }
}

export default PostService;
