import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export default async function (fastify: FastifyInstance) {

    fastify.get('/me', {preValidation: [fastify.authenticate]}, async (request, reply) =>{
        await request.jwtVerify();
        const userId = Number((request.user as any).sub);
        const user = await prisma.user.findUnique({ where: { id: userId}, select: { id: true, name: true, email: true}});
        if (!user) return reply.status(404).send({ error: 'User not found' });
        return reply.send(user);
    });

    fastify.patch('/me', { preValidation: [fastify.authenticate]}, async (request, reply) => {
        await request.jwtVerify();
        const userId = Number((request.user as any).sub);

        const body = z.object({
            name: z.string().min(1).optional(),
            email: z.string().email().optional()
        }).parse(request.body);

        if(body.email) {
            const conflict = await prisma.user.findUnique({ where: { email: body.email}});
            if (conflict && conflict.id !== userId) {
                return reply.status(409).send({ error: 'Email already used'});
            }
        }

        const updated = await prisma.user.update({
            where: {id: userId },
            data: { ...body}
        });
    
    return reply.send({ id: updated.id, name: updated.name, email: updated.email });
    });
}