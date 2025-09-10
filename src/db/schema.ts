import { pgTable, text, timestamp, boolean, varchar,
  integer,
  uuid, pgEnum} from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";
import { relations } from "drizzle-orm"; // ✅ Import `relations`

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});


export const campaigns = pgTable('campaigns', {
  // Core Fields
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(false).notNull(), // Manages Active/Inactive status
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  // Sequence Message Templates
  requestMessageTemplate: text('request_message_template'),
  connectionMessageTemplate: text('connection_message_template'),

  firstFollowUpMessageTemplate: text('first_follow_up_message_template'),
  firstFollowUpDelayDays: integer('first_follow_up_delay_days').default(1),

  secondFollowUpMessageTemplate: text('second_follow_up_message_template'),
  secondFollowUpDelayDays: integer('second_follow_up_delay_days').default(3),

  // Settings
  allowNoPersonalization: boolean('allow_no_personalization').default(false),
  // The "Selected Account" for AutoPilot would likely be the user's account,
  // so it's implicitly handled by the `userId`.

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});



// --- LEADS & EVENTS TABLES ---
export const leadStatusEnum = pgEnum('lead_status', [
  'PENDING', 'ACCEPTED', 'REJECTED', 'MESSAGED', 'CONNECTED', 'NOT_INTERESTED'
]);

export const leads = pgTable('leads', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }),
  position: varchar('position', { length: 255 }),
  status: leadStatusEnum('status').default('PENDING').notNull(),
  // Stage progression flags for campaign sequence
  stageConnectionRequested: boolean('stage_connection_requested').default(false).notNull(),
  stageFirstFollowupSent: boolean('stage_first_followup_sent').default(false).notNull(),
  stageSecondFollowupSent: boolean('stage_second_followup_sent').default(false).notNull(),
  campaignId: text('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const leadEvents = pgTable('lead_events', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  leadId: text('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(),
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});




// ✅ --- CORRECTED RELATIONS ---
// This explicit mapping will generate a clean and simple LEFT JOIN query.

export const userRelations = relations(user, ({ many }) => ({
  campaigns: many(campaigns),
  leads: many(leads),
}));

export const campaignRelations = relations(campaigns, ({ one, many }) => ({
  // A campaign belongs to ONE user
  user: one(user, {
    fields: [campaigns.userId],
    references: [user.id],
  }),
  // A campaign has MANY leads
  leads: many(leads),
}));

export const leadRelations = relations(leads, ({ one, many }) => ({
  // A lead belongs to ONE user
  user: one(user, {
    fields: [leads.userId],
    references: [user.id],
  }),
  // ✅ A lead belongs to ONE campaign. This is the key fix.
  campaign: one(campaigns, {
    fields: [leads.campaignId],
    references: [campaigns.id],
  }),
  // A lead has MANY events
  events: many(leadEvents),
}));

export const leadEventRelations = relations(leadEvents, ({ one }) => ({
  // An event belongs to ONE lead
  lead: one(leads, {
    fields: [leadEvents.leadId],
    references: [leads.id],
  }),
}));
