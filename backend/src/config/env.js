require("dotenv").config();
const { z } = require("zod");

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  HOST: z.string().default("127.0.0.1"),

  CLIENT_ORIGIN: z.string().url(),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(32),

  CSRF_SECRET: z.string().min(32),

  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),

  SESSION_TTL_HOURS: z.coerce.number().int().positive().default(168),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration: ");
  result.error.issues.forEach((issue) => {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  });
  process.exit(1);
}

module.exports = Object.freeze(result.data);
