import { 
  type User, 
  type InsertUser,
  type Professional,
  type InsertProfessional,
  type Service,
  type InsertService,
  type Booking,
  type InsertBooking,
  type Message,
  type InsertMessage,
  type Requirement,
  type InsertRequirement,
  users,
  professionals,
  services,
  bookings,
  messages,
  requirements
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, like, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Professional operations
  getProfessional(id: string): Promise<Professional | undefined>;
  getProfessionalByUserId(userId: string): Promise<Professional | undefined>;
  createProfessional(professional: InsertProfessional): Promise<Professional>;
  updateProfessional(id: string, updates: Partial<Professional>): Promise<Professional | undefined>;
  getAllProfessionals(): Promise<Professional[]>;
  getProfessionalsBySpecialization(specialization: string): Promise<Professional[]>;

  // Service operations
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  getServicesByProfessional(professionalId: string): Promise<Service[]>;
  getAllServices(): Promise<Service[]>;

  // Booking operations
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByBusiness(businessId: string): Promise<Booking[]>;
  getBookingsByProfessional(professionalId: string): Promise<Booking[]>;
  updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined>;

  // Message operations
  getMessage(id: string): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByBooking(bookingId: string): Promise<Message[]>;

  // Requirement operations
  getRequirement(id: string): Promise<Requirement | undefined>;
  createRequirement(requirement: InsertRequirement): Promise<Requirement>;
  getRequirementsByBusiness(businessId: string): Promise<Requirement[]>;
  getAllRequirements(): Promise<Requirement[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        createdAt: new Date(),
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Professional operations
  async getProfessional(id: string): Promise<Professional | undefined> {
    const [professional] = await db.select().from(professionals).where(eq(professionals.id, id));
    return professional || undefined;
  }

  async getProfessionalByUserId(userId: string): Promise<Professional | undefined> {
    const [professional] = await db.select().from(professionals).where(eq(professionals.userId, userId));
    return professional || undefined;
  }

  async createProfessional(insertProfessional: InsertProfessional): Promise<Professional> {
    const [professional] = await db
      .insert(professionals)
      .values({
        ...insertProfessional,
        createdAt: new Date(),
      })
      .returning();
    return professional;
  }

  async updateProfessional(id: string, updates: Partial<Professional>): Promise<Professional | undefined> {
    const [professional] = await db
      .update(professionals)
      .set(updates)
      .where(eq(professionals.id, id))
      .returning();
    return professional || undefined;
  }

  async getAllProfessionals(): Promise<Professional[]> {
    return await db.select().from(professionals);
  }

  async getProfessionalsBySpecialization(specialization: string): Promise<Professional[]> {
    return await db.select().from(professionals).where(like(professionals.specializations, `%${specialization}%`));
  }

  // Service operations
  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values({
        ...insertService,
        createdAt: new Date(),
      })
      .returning();
    return service;
  }

  async getServicesByProfessional(professionalId: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.professionalId, professionalId));
  }

  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  // Booking operations
  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values({
        ...insertBooking,
        createdAt: new Date(),
      })
      .returning();
    return booking;
  }

  async getBookingsByBusiness(businessId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.businessId, businessId));
  }

  async getBookingsByProfessional(professionalId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.professionalId, professionalId));
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const [booking] = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, id))
      .returning();
    return booking || undefined;
  }

  // Message operations
  async getMessage(id: string): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message || undefined;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values({
        ...insertMessage,
        sentAt: new Date(),
      })
      .returning();
    return message;
  }

  async getMessagesByBooking(bookingId: string): Promise<Message[]> {
    const result = await db.select().from(messages)
      .where(eq(messages.bookingId, bookingId));
    return result.sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
  }

  // Requirement operations
  async getRequirement(id: string): Promise<Requirement | undefined> {
    const [requirement] = await db.select().from(requirements).where(eq(requirements.id, id));
    return requirement || undefined;
  }

  async createRequirement(insertRequirement: InsertRequirement): Promise<Requirement> {
    const [requirement] = await db
      .insert(requirements)
      .values({
        ...insertRequirement,
        createdAt: new Date(),
      })
      .returning();
    return requirement;
  }

  async getRequirementsByBusiness(businessId: string): Promise<Requirement[]> {
    return await db.select().from(requirements).where(eq(requirements.businessId, businessId));
  }

  async getAllRequirements(): Promise<Requirement[]> {
    return await db.select().from(requirements);
  }
}

export const storage = new DatabaseStorage();