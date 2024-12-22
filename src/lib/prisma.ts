import { PrismaClient } from "@prisma/client";

/**
 *  This global variable ensures that the Prisma client instance is
 *  reused across hot reloads during development. Without this, each time your application
 *  reloads, a new instance of the Prisma client would be created, potentially leading
 *  to connection issues.
 */

declare global {
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}
