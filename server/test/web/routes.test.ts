import tap from 'tap';
import build from '../base';
import Post from "../../models/post";

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

tap.test('request a not existing route should return 404',  async t => {
    const fastify = t.context.fastify;

    t.plan(2);

    const response = await fastify.inject({
        method: 'GET',
        url: '/not-existing-route'
    });

    t.equal(response.statusCode, 404);
    t.equal(response.statusMessage, 'Not Found');
});

tap.test('request an existing route should return 200',  async t => {
    const fastify = t.context.fastify;

    t.plan(2);

    const post = await Post.query()
        .select('*')
        .first();

    const response = await fastify.inject({
        method: 'GET',
        url: `/${post?.slug}`
    });

    t.equal(response.statusCode, 200);
    t.equal(response.statusMessage, 'OK');
});
