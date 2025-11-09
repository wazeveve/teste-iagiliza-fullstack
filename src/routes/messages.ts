import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { prisma } from '../lib/prisma'
import { request } from "http";

const iaResponses = [
    "Gostaria que eu criasse um texto sobre isso de 40 linhas como se fosse um Aluno de Graduaçã?",
    "Obrigado por me corrigir, realmente havia um erro, gostaria que eu corrigisse?",
    "Ainda não tenho certeza se compreendi, poderia me explicar melhor?",
    "É um tema deveras interessante, conte-me um pouco mais...",
    "Não posso responder a essa pergunte infelizmente."
];

export default async function (fastify: FastifyInstance) {

    fastify.get('/messages', { preValidation: [fastify.authenticate]}, async (request, reply) => {
        await request.jwtVerify();
        const userId = Number((request.user as any).sub);
        const messages = await prisma.message.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' }
        });
        return reply.send(messages);
    });

    fastify.post('/message', {preValidation: [fastify.authenticate]}, async(request, reply) => {
        await request.jwtVerify();
        const bodySchema = z.object({ content: z.string().min(1) });
        const { content } = bodySchema.parse(request.body);
        const userId = Number((request.user as any).sub);

        const userMessage = await prisma.message.create({
            data: {userId, content, fromAI: false}
        });

        const iaText = iaResponses[Math.floor(Math.random() * iaResponses.length)];

        const iaMessage = await prisma.message.create({
            data: {userId, content: iaText, fromAI: true }
        });

        return reply.send({ userMessage, iaMessage});
    });
}