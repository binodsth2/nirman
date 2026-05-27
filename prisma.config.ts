import "dotenv/config";
import { defineConfig } from "prisma/config";

const dbType = process.env.DATABASE_TYPE;
let path;
if (dbType === "mysql") {
  path = "prisma/migrations/mysql";
} else if (dbType === "postgresql") {
  path = "prisma/migrations/postgresql";
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path,
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
