import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional(),
);

const optionalUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().url().optional(),
);

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().default("file:./data/tryeyeglasses.sqlite"),
  AUTH_SECRET: optionalString,
  OPENAI_API_KEY: optionalString,
  IMAGE_MODEL: z.string().default("gpt-image-2"),
  IMAGE_MODEL_SNAPSHOT: optionalString,
  IMAGE_OUTPUT_COUNT: z.coerce.number().int().positive().default(1),
  IMAGE_SIZE: z.string().default("1536x1024"),
  IMAGE_QUALITY: z.string().default("medium"),
  R2_ACCOUNT_ID: optionalString,
  R2_ACCESS_KEY_ID: optionalString,
  R2_SECRET_ACCESS_KEY: optionalString,
  R2_BUCKET: optionalString,
  R2_PUBLIC_BASE_URL: optionalUrl,
  PAYPAL_CLIENT_ID: optionalString,
  PAYPAL_CLIENT_SECRET: optionalString,
  PAYPAL_ENV: z.enum(["sandbox", "live"]).default("sandbox"),
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: optionalString,
  INDEXNOW_KEY: optionalString,
});

let parsedEnv: z.infer<typeof envSchema> | null = null;

export function env() {
  if (!parsedEnv) {
    parsedEnv = envSchema.parse(process.env);
  }

  return parsedEnv;
}

export function requireEnv<T extends keyof ReturnType<typeof env>>(key: T) {
  const value = env()[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}
