import tap from 'tap';
import build from '../base';
import Post from "../../models/post";
import User from "../../models/user";
import Comment from "../../models/comment";

tap.beforeEach(async t => {
    const fastify = await build(t);
    await fastify.database.migrate.latest();
    await fastify.database.seed.run();

    t.context.fastify = fastify;
});

tap.afterEach(async t => {
    const fastify = t.context.fastify;

    await fastify.database.migrate.rollback();
    await fastify.database.destroy();
})


tap.test('post comment should return 200 and the right data',  async t => {
    const fastify = t.context.fastify;

    const post = await Post.query()
        .select('*')
        .first();

    t.plan(2);

    if (post === undefined) {
        t.fail("No post found");
        return;
    }

    const response = await fastify.inject({
        method: 'POST',
        url: `/api/posts/${post.id}/comments`,
        payload: {'comment': 'Lorem Ipsum'}
    });

    const expectedJSON = {
        "content":"Lorem Ipsum",
        "post_id": post.id,
        "upvotes_count": 0,
        "readable_created_at": "a few seconds ago",
    }

    t.equal(response.statusCode, 200);
    t.has(response.json(), expectedJSON);
});


tap.test('upvote comment should return 200 and the right data',  async t => {
    const fastify = t.context.fastify;

    const post = await Post.query()
        .select('*')
        .first();

    if (post === undefined) {
        t.fail("No post found");
        return;
    }

    const user = await User.query()
        .select('*')
        .first();

    if (user === undefined) {
        t.fail("No post found");
        return;
    }

    t.plan(2);

    const data: object = {
        content: 'Lorem Ipsum',
        post_id: post.id,
        user_id: user.id,
    }
    const comment = await Comment.query()
        .insert(data);
    const response = await fastify.inject({
        method: 'POST',
        url: `/api/comments/${comment.id}/upvote`,
    });

    const expectedJSON = {
        "content":"Lorem Ipsum",    
        "post_id": post.id,
        "upvotes_count": 1,
        "readable_created_at": "a few seconds ago",
    }

    t.equal(response.statusCode, 200);
    t.has(response.json(), expectedJSON);
});
