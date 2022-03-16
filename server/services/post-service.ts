import Post from "../models/post";

class PostService {

    async findBySlug(slug: string): Promise<Post | undefined> {
        return Post.query()
            .withGraphFetched('comments.[user, upvotes]')
            .modifyGraph('comments', builder => {
                builder.orderBy('id', 'DESC');
            })
            .select('*')
            .where({
                slug: slug
            })
            .first();
    }
}

export default PostService;
