import fastify from 'fastify';
import app from './app';

const server = fastify({
    logger: {
        level: 'info',
    },
    ignoreTrailingSlash: true,
});
server.register(app);

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
