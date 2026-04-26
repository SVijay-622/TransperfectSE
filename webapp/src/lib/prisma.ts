import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set.');
    }
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({ adapter });
}

declare global {
    // eslint-disable-next-line no-var
    var prismaGlobal: PrismaClient | undefined;
}

const prisma: PrismaClient = globalThis.prismaGlobal ?? createPrismaClient();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
