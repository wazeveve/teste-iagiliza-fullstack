import 'dotenv/config';
import Fastify from 'fastify';
import jwtPlugin from './plugins/jwt';
import { prisma } from './lib/prisma';
import fastifyCors from '@fastify/cors';
import authRoutes from './routes/auth';
import meRoutes from './routes/me';
import messagesRoutes from './routes/messages';


const server = Fastify({ logger: true });

server.register(jwtPlugin); // Import routes modules
server.register(fastifyCors, {
  origin: true, //
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
});


// Route Register 
server.register(authRoutes, { prefix: '/auth'});
server.register(meRoutes);
server.register(messagesRoutes);

server.log.info(server.printRoutes());


const start = async ()=>{
    try{
        await prisma.$connect(); //Open connection with DB
        await server.listen({port: 3333, host: '0.0.0.0'}); //start server at port 3333
        console.log("Server running: http://localhost:3333")
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start()
