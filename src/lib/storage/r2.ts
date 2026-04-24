import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env, requireEnv } from "@/lib/config";

let client: S3Client | null = null;

export function getR2Client() {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
        secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
      },
    });
  }

  return client;
}

export async function storeResultImage(input: {
  key: string;
  bytes: Buffer;
  contentType: string;
}) {
  if (!env().R2_BUCKET || !env().R2_PUBLIC_BASE_URL) {
    return {
      objectKey: input.key,
      publicUrl: `data:${input.contentType};base64,${input.bytes.toString("base64")}`,
      stored: false,
    };
  }

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: requireEnv("R2_BUCKET"),
      Key: input.key,
      Body: input.bytes,
      ContentType: input.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    objectKey: input.key,
    publicUrl: `${env().R2_PUBLIC_BASE_URL}/${input.key}`,
    stored: true,
  };
}
