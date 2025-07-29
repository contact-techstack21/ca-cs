import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().$type<'business' | 'professional' | 'admin'>(),
  name: text("name").notNull(),
  phone: text("phone"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const professionals = pgTable("professionals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  registrationNumber: text("registration_number").notNull(),
  qualification: text("qualification").notNull().$type<'CA' | 'CS'>(),
  specializations: jsonb("specializations").$type<string[]>(),
  experience: integer("experience"),
  city: text("city"),
  bio: text("bio"),
  hourlyRate: integer("hourly_rate"),
  rating: integer("rating").default(0),
  totalReviews: integer("total_reviews").default(0),
  kycStatus: text("kyc_status").default('pending').$type<'pending' | 'approved' | 'rejected'>(),
  kycDocuments: jsonb("kyc_documents").$type<{pan?: string, aadhaar?: string, certificate?: string}>(),
  availability: jsonb("availability").$type<{[key: string]: string[]}>(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  professionalId: varchar("professional_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  duration: integer("duration"), // in minutes
  isActive: boolean("is_active").default(true),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").notNull(),
  professionalId: varchar("professional_id").notNull(),
  serviceId: varchar("service_id").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  status: text("status").default('pending').$type<'pending' | 'confirmed' | 'completed' | 'cancelled'>(),
  totalAmount: integer("total_amount").notNull(),
  paymentStatus: text("payment_status").default('pending').$type<'pending' | 'paid' | 'refunded'>(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull(),
  senderId: varchar("sender_id").notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
});

export const requirements = pgTable("requirements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  urgency: text("urgency").$type<'low' | 'medium' | 'high'>(),
  budget: integer("budget"),
  status: text("status").default('open').$type<'open' | 'in_progress' | 'completed' | 'closed'>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProfessionalSchema = createInsertSchema(professionals).omit({
  id: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  sentAt: true,
});

export const insertRequirementSchema = createInsertSchema(requirements).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type Professional = typeof professionals.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Requirement = typeof requirements.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProfessional = z.infer<typeof insertProfessionalSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertRequirement = z.infer<typeof insertRequirementSchema>;
