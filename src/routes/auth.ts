import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs';

export default async function (fastify: FastifyInstance) {

    fastify.post('/register', async (request, reply) =>{
        const bodySchema = z.object({
            name: z.string().min(1),
            email: z.string().email(),
            password: z.string().min(6)
        });
        const {name, email, password} = bodySchema.parse(request.body);

        const exists = await prisma.user.findUnique({ where: {email}});
        if (exists) return reply.status(409).send({ error: 'Email already registered'});

        const hashed = await bcrypt.hash(password, 8);

        const user = await prisma.user.create({
            data: {name, email, password: hashed}
        });

        const token = fastify.jwt.sign({ sub: String(user.id), email: user.email});

        return reply.status(201).send({ user: {id: user.id, name: user.name, email: user.email}, token});
    });

    fastify.post('/login', async (request, reply) => {
        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(6)
        });
        const { email, password } = bodySchema.parse(request.body);

        const user = await prisma.user.findUnique({ where: {email}});
        if (!user) return reply.status(401).send({ error: 'Invalid credentials'});

        const token = fastify.jwt.sign({ sub: String(user.id), email: user.email});

        return reply.send({user: {id: user.id, name: user.name, email: user.email}, token});
    });
}