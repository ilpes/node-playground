import Fastify, {FastifyInstance} from "fastify";
import app from "../app";
import fp from "fastify-plugin";

export const build =  async (t: Tap.Test): Promise<FastifyInstance> => {

    // Set the proper environment
    process.env.NODE_ENV = 'test';

    // fastify-plugin ensures that all decorators
    // are exposed for testing purposes, this is
    // different from the production setup
    const fastify: FastifyInstance = Fastify();
    await fastify.register(fp(app));

    // tear down our app after we are done
    t.teardown(() => {
        fastify.close();
        console.log(`Tearing down`);
    });

    return fastify;
}


export default build;
