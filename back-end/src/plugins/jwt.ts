import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { FastifyInstance } from 'fastify'; 


export default fp(async (fastify: FastifyInstance) => {
    fastify.register(fastifyJwt, {
        secret: process.env.JWT_SECRET || 'dev_secret' //Registering plugin JWT
    });


    fastify.decorate('authenticate', async (request: any, reply: any) => { //Reuse authentication
        try {
            await request.jwtVerify();
        } catch(err) {
            reply.send(err);
        }
    });
});