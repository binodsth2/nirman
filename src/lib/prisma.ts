import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const connectionString = process.env.DATABASE_URL;
const dbType = process.env.DATABASE_TYPE;

const createPrismaClient = () => {
    if (!connectionString) {
        throw new Error("DATABASE_URL environment variable is not defined");
    }

    let adapter;

    // Use the appropriate adapter based on the database type
    // Note: Ensure the 'provider' in your schema.prisma matches the dialect of the database you are using.
    if (dbType === "mysql") {
        console.log("🛠️ Initializing Prisma with MariaDB/MySQL adapter...");
        adapter = new PrismaMariaDb(connectionString);
    } else if (dbType === "postgresql") {
        console.log("🛠️ Initializing Prisma with PostgreSQL adapter...");
        adapter = new PrismaPg(connectionString);
    } else {
        // Fallback or default behavior if no adapter is needed (e.g. standard Prisma behavior)
        console.log(`ℹ️ No adapter configured for dbType: ${dbType}. Using default Prisma client.`);
        return new PrismaClient();
    }

    return new PrismaClient({ adapter });
};

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}