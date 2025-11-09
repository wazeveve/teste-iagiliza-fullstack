import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient(); // Avoid double conections

