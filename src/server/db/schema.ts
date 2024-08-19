// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql, relations } from "drizzle-orm";

import {
  index,
  boolean,
  integer,
  pgTableCreator,
  timestamp,
  primaryKey,
  varchar,
  pgEnum,
  text,
  jsonb,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `spireo.ai_${name}`);

export const statusEnum = pgEnum("status", ["saved", "scheduled", "published"]);

export const drafts = createTable("draft", {
  id: varchar("id", { length: 512 }).primaryKey().notNull(),
  name: varchar("name", { length: 512 }),
  status: statusEnum("status"),
  userId: varchar("user_id", { length: 512 }),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
  linkedInId: varchar("linked_in_id", { length: 512 }),
  content: text("content"),
  documentUrn: varchar("document_urn", { length: 512 }),
  documentTitle: varchar("document_title", { length: 512 }),
  timeZone: varchar("time_zone", { length: 512 }),
  downloadUrl: varchar("download_url", { length: 512 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    precision: 3,
  }).$onUpdate(() => new Date()),
});

export const ideas = createTable("idea", {
  id: varchar("id", { length: 256 }).primaryKey().notNull(),
  userId: varchar("user_id", { length: 256 }),
  content: text("content"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  updatedAt: timestamp("updated_at", {
    mode: "date",
    precision: 3,
  }).$onUpdate(() => new Date()),
});

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
  hasAccess: boolean("hasAccess").default(true),
  priceId: varchar("price_id", { length: 255 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  headline: varchar("headline", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  trialEndsAt: timestamp("trial_ends_at"),
  onboardingCompleted: boolean("onboarding_complete").default(false),
  generatedWords: integer("generated_words").default(0),
  onboardingData: jsonb("onboarding_data"),
  specialAccess: boolean("special_access").default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  contentStyles: many(contentStyles),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const contentStyles = createTable("content_style", {
  id: varchar("id", { length: 256 }).primaryKey().notNull(),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 256 }).notNull(),
  examples: text("examples").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    precision: 3,
  }).$onUpdate(() => new Date()),
});

export const contentStyleRelations = relations(contentStyles, ({ one }) => ({
  user: one(users, { fields: [contentStyles.userId], references: [users.id] }),
}));

export const sessions = createTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = createTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);
