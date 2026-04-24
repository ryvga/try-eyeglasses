import { relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
};

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  ...timestamps,
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),
  ...timestamps,
});

export const anonymousGenerationClaims = sqliteTable(
  "anonymous_generation_claims",
  {
    id: text("id").primaryKey(),
    fingerprintHash: text("fingerprint_hash").notNull(),
    ipHash: text("ip_hash"),
    userAgentHash: text("user_agent_hash"),
    generationId: text("generation_id"),
    ...timestamps,
  },
  (table) => ({
    fingerprintIdx: uniqueIndex("anonymous_claim_fingerprint_idx").on(
      table.fingerprintHash,
    ),
  }),
);

export const glassesStyles = sqliteTable("glasses_styles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  family: text("family").notNull(),
  fit: text("fit").notNull(),
  color: text("color").notNull(),
  material: text("material").notNull(),
  promptNotes: text("prompt_notes").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const userUploadedStyles = sqliteTable("user_uploaded_styles", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  sourceObjectKey: text("source_object_key"),
  extractedDescription: text("extracted_description").notNull(),
  ...timestamps,
});

export const generations = sqliteTable("generations", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  anonymousClaimId: text("anonymous_claim_id").references(
    () => anonymousGenerationClaims.id,
    { onDelete: "set null" },
  ),
  styleId: text("style_id").references(() => glassesStyles.id, {
    onDelete: "set null",
  }),
  uploadedStyleId: text("uploaded_style_id").references(
    () => userUploadedStyles.id,
    { onDelete: "set null" },
  ),
  prompt: text("prompt").notNull(),
  model: text("model").notNull(),
  quality: text("quality").notNull(),
  size: text("size").notNull(),
  sourceDeletedAt: text("source_deleted_at"),
  resultObjectKey: text("result_object_key"),
  resultUrl: text("result_url"),
  status: text("status", {
    enum: ["pending", "succeeded", "failed"],
  })
    .notNull()
    .default("pending"),
  failureReason: text("failure_reason"),
  ...timestamps,
});

export const creditLedger = sqliteTable("credit_ledger", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  generationId: text("generation_id").references(() => generations.id, {
    onDelete: "set null",
  }),
  delta: integer("delta").notNull(),
  reason: text("reason", {
    enum: ["purchase", "generation", "refund", "admin_adjustment"],
  }).notNull(),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  ...timestamps,
});

export const paypalOrders = sqliteTable("paypal_orders", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  paypalOrderId: text("paypal_order_id").notNull().unique(),
  paypalCaptureId: text("paypal_capture_id"),
  status: text("status", {
    enum: ["created", "captured", "failed"],
  })
    .notNull()
    .default("created"),
  credits: integer("credits").notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull().default("USD"),
  ...timestamps,
});

export const usersRelations = relations(users, ({ many }) => ({
  generations: many(generations),
  creditLedger: many(creditLedger),
}));

export const generationsRelations = relations(generations, ({ one }) => ({
  user: one(users, {
    fields: [generations.userId],
    references: [users.id],
  }),
  style: one(glassesStyles, {
    fields: [generations.styleId],
    references: [glassesStyles.id],
  }),
}));
