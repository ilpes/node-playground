import fastify from 'fastify';
import app from './app';

const server = fastify();

server.register(app);

server.get('/ping', async (request, reply) => {
    return 'pong\n'
});

const defaultPort = 3000;
const port = process.env.PORT ?? defaultPort;
const host = process.env.HOST ?? '0.0.0.0';

server.listen(port, host, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`)
});
