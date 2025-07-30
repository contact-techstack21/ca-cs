var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bookings: () => bookings,
  insertBookingSchema: () => insertBookingSchema,
  insertMessageSchema: () => insertMessageSchema,
  insertProfessionalSchema: () => insertProfessionalSchema,
  insertRequirementSchema: () => insertRequirementSchema,
  insertServiceSchema: () => insertServiceSchema,
  insertUserSchema: () => insertUserSchema,
  messages: () => messages,
  professionals: () => professionals,
  requirements: () => requirements,
  services: () => services,
  users: () => users
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().$type(),
  name: text("name").notNull(),
  phone: text("phone"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var professionals = pgTable("professionals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  registrationNumber: text("registration_number").notNull(),
  qualification: text("qualification").notNull().$type(),
  specializations: jsonb("specializations").$type(),
  experience: integer("experience"),
  city: text("city"),
  bio: text("bio"),
  hourlyRate: integer("hourly_rate"),
  rating: integer("rating").default(0),
  totalReviews: integer("total_reviews").default(0),
  kycStatus: text("kyc_status").default("pending").$type(),
  kycDocuments: jsonb("kyc_documents").$type(),
  availability: jsonb("availability").$type(),
  createdAt: timestamp("created_at").defaultNow()
});
var services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  professionalId: varchar("professional_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  duration: integer("duration"),
  // in minutes
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").notNull(),
  professionalId: varchar("professional_id").notNull(),
  serviceId: varchar("service_id").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  status: text("status").default("pending").$type(),
  totalAmount: integer("total_amount").notNull(),
  paymentStatus: text("payment_status").default("pending").$type(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull(),
  senderId: varchar("sender_id").notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow()
});
var requirements = pgTable("requirements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  urgency: text("urgency").$type(),
  budget: integer("budget"),
  status: text("status").default("open").$type(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertProfessionalSchema = createInsertSchema(professionals).omit({
  id: true,
  createdAt: true
});
var insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true
});
var insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true
});
var insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  sentAt: true
});
var insertRequirementSchema = createInsertSchema(requirements).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, like } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUser(id, updates) {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || void 0;
  }
  // Professional operations
  async getProfessional(id) {
    const [professional] = await db.select().from(professionals).where(eq(professionals.id, id));
    return professional || void 0;
  }
  async getProfessionalByUserId(userId) {
    const [professional] = await db.select().from(professionals).where(eq(professionals.userId, userId));
    return professional || void 0;
  }
  async createProfessional(insertProfessional) {
    const [professional] = await db.insert(professionals).values(insertProfessional).returning();
    return professional;
  }
  async updateProfessional(id, updates) {
    const [professional] = await db.update(professionals).set(updates).where(eq(professionals.id, id)).returning();
    return professional || void 0;
  }
  async getAllProfessionals() {
    return await db.select().from(professionals);
  }
  async getProfessionalsBySpecialization(specialization) {
    return await db.select().from(professionals).where(like(professionals.specializations, `%${specialization}%`));
  }
  // Service operations
  async getService(id) {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || void 0;
  }
  async createService(insertService) {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }
  async getServicesByProfessional(professionalId) {
    return await db.select().from(services).where(eq(services.professionalId, professionalId));
  }
  async getAllServices() {
    return await db.select().from(services);
  }
  // Booking operations
  async getBooking(id) {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || void 0;
  }
  async createBooking(insertBooking) {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    return booking;
  }
  async getBookingsByBusiness(businessId) {
    return await db.select().from(bookings).where(eq(bookings.businessId, businessId));
  }
  async getBookingsByProfessional(professionalId) {
    return await db.select().from(bookings).where(eq(bookings.professionalId, professionalId));
  }
  async updateBooking(id, updates) {
    const [booking] = await db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
    return booking || void 0;
  }
  // Message operations
  async getMessage(id) {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message || void 0;
  }
  async createMessage(insertMessage) {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }
  async getMessagesByBooking(bookingId) {
    const result = await db.select().from(messages).where(eq(messages.bookingId, bookingId));
    return result.sort((a, b) => (a.sentAt?.getTime() || 0) - (b.sentAt?.getTime() || 0));
  }
  // Requirement operations
  async getRequirement(id) {
    const [requirement] = await db.select().from(requirements).where(eq(requirements.id, id));
    return requirement || void 0;
  }
  async createRequirement(insertRequirement) {
    const [requirement] = await db.insert(requirements).values(insertRequirement).returning();
    return requirement;
  }
  async getRequirementsByBusiness(businessId) {
    return await db.select().from(requirements).where(eq(requirements.businessId, businessId));
  }
  async getAllRequirements() {
    return await db.select().from(requirements);
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
var loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token: "mock-jwt-token" });
    } catch (error) {
      res.status(400).json({ message: "Invalid login data", error });
    }
  });
  app2.get("/api/users/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  app2.post("/api/professionals", async (req, res) => {
    try {
      const professionalData = insertProfessionalSchema.parse(req.body);
      const professional = await storage.createProfessional(professionalData);
      res.status(201).json(professional);
    } catch (error) {
      res.status(400).json({ message: "Invalid professional data", error });
    }
  });
  app2.get("/api/professionals", async (req, res) => {
    try {
      const { specialization, city } = req.query;
      let professionals2 = await storage.getAllProfessionals();
      if (specialization) {
        professionals2 = professionals2.filter(
          (prof) => prof.specializations?.includes(specialization)
        );
      }
      if (city) {
        professionals2 = professionals2.filter((prof) => prof.city === city);
      }
      const professionalsWithUsers = await Promise.all(
        professionals2.map(async (prof) => {
          const user = await storage.getUser(prof.userId);
          return {
            ...prof,
            user: user ? { id: user.id, name: user.name, email: user.email } : null
          };
        })
      );
      res.json(professionalsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching professionals", error });
    }
  });
  app2.get("/api/professionals/:id", async (req, res) => {
    try {
      const professional = await storage.getProfessional(req.params.id);
      if (!professional) {
        return res.status(404).json({ message: "Professional not found" });
      }
      const user = await storage.getUser(professional.userId);
      res.json({
        ...professional,
        user: user ? { id: user.id, name: user.name, email: user.email } : null
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching professional", error });
    }
  });
  app2.put("/api/professionals/:id/kyc", async (req, res) => {
    try {
      const { status, documents } = req.body;
      const professional = await storage.updateProfessional(req.params.id, {
        kycStatus: status,
        kycDocuments: documents
      });
      if (!professional) {
        return res.status(404).json({ message: "Professional not found" });
      }
      res.json(professional);
    } catch (error) {
      res.status(500).json({ message: "Error updating KYC status", error });
    }
  });
  app2.get("/api/services", async (req, res) => {
    try {
      const services2 = await storage.getAllServices();
      const servicesWithDetails = await Promise.all(
        services2.map(async (service) => {
          const professional = await storage.getProfessional(service.professionalId);
          const user = professional ? await storage.getUser(professional.userId) : null;
          return {
            ...service,
            professional: professional ? {
              ...professional,
              user: user ? { id: user.id, name: user.name } : null
            } : null
          };
        })
      );
      res.json(servicesWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Error fetching services", error });
    }
  });
  app2.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: "Invalid booking data", error });
    }
  });
  app2.get("/api/bookings/business/:businessId", async (req, res) => {
    try {
      const bookings2 = await storage.getBookingsByBusiness(req.params.businessId);
      const bookingsWithDetails = await Promise.all(
        bookings2.map(async (booking) => {
          const service = await storage.getService(booking.serviceId);
          const professional = await storage.getProfessional(booking.professionalId);
          const user = professional ? await storage.getUser(professional.userId) : null;
          return {
            ...booking,
            service,
            professional: professional ? {
              ...professional,
              user: user ? { id: user.id, name: user.name } : null
            } : null
          };
        })
      );
      res.json(bookingsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings", error });
    }
  });
  app2.get("/api/bookings/professional/:professionalId", async (req, res) => {
    try {
      const bookings2 = await storage.getBookingsByProfessional(req.params.professionalId);
      const bookingsWithDetails = await Promise.all(
        bookings2.map(async (booking) => {
          const service = await storage.getService(booking.serviceId);
          const businessUser = await storage.getUser(booking.businessId);
          return {
            ...booking,
            service,
            businessUser: businessUser ? { id: businessUser.id, name: businessUser.name } : null
          };
        })
      );
      res.json(bookingsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings", error });
    }
  });
  app2.put("/api/bookings/:id", async (req, res) => {
    try {
      const updates = req.body;
      const booking = await storage.updateBooking(req.params.id, updates);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Error updating booking", error });
    }
  });
  app2.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data", error });
    }
  });
  app2.get("/api/messages/booking/:bookingId", async (req, res) => {
    try {
      const messages2 = await storage.getMessagesByBooking(req.params.bookingId);
      const messagesWithSenders = await Promise.all(
        messages2.map(async (message) => {
          const sender = await storage.getUser(message.senderId);
          return {
            ...message,
            sender: sender ? { id: sender.id, name: sender.name } : null
          };
        })
      );
      res.json(messagesWithSenders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages", error });
    }
  });
  app2.post("/api/requirements", async (req, res) => {
    try {
      const requirementData = insertRequirementSchema.parse(req.body);
      const requirement = await storage.createRequirement(requirementData);
      res.status(201).json(requirement);
    } catch (error) {
      res.status(400).json({ message: "Invalid requirement data", error });
    }
  });
  app2.get("/api/requirements", async (req, res) => {
    try {
      const requirements2 = await storage.getAllRequirements();
      const requirementsWithUsers = await Promise.all(
        requirements2.map(async (req2) => {
          const user = await storage.getUser(req2.businessId);
          return {
            ...req2,
            businessUser: user ? { id: user.id, name: user.name } : null
          };
        })
      );
      res.json(requirementsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching requirements", error });
    }
  });
  app2.get("/api/requirements/business/:businessId", async (req, res) => {
    try {
      const requirements2 = await storage.getRequirementsByBusiness(req.params.businessId);
      res.json(requirements2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching requirements", error });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/seed.ts
async function seedDatabase() {
  try {
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already seeded");
      return;
    }
    console.log("Seeding database...");
    const [admin] = await db.insert(users).values({
      email: "admin@complianceconnect.com",
      password: "$2b$10$hash",
      // In real app, would be properly hashed
      role: "admin",
      name: "System Admin",
      phone: "+91 9876543210",
      isVerified: true
    }).returning();
    const [business] = await db.insert(users).values({
      email: "business@example.com",
      password: "$2b$10$hash",
      role: "business",
      name: "ABC Private Limited",
      phone: "+91 9876543213",
      isVerified: true
    }).returning();
    const professionalUsers = [
      {
        email: "rajesh.kumar@email.com",
        password: "$2b$10$hash",
        role: "professional",
        name: "CA Rajesh Kumar",
        phone: "+91 9876543211",
        isVerified: true
      },
      {
        email: "priya.sharma@email.com",
        password: "$2b$10$hash",
        role: "professional",
        name: "CS Priya Sharma",
        phone: "+91 9876543212",
        isVerified: true
      },
      {
        email: "vikash.singh@email.com",
        password: "$2b$10$hash",
        role: "professional",
        name: "CA Vikash Singh",
        phone: "+91 9876543214",
        isVerified: true
      }
    ];
    const insertedProfessionalUsers = await db.insert(users).values(professionalUsers).returning();
    const professionalProfiles = [
      {
        userId: insertedProfessionalUsers[0].id,
        registrationNumber: "CA123456",
        qualification: "CA",
        specializations: ["Tax Planning", "GST Returns", "Audit"],
        experience: 15,
        city: "Mumbai",
        bio: "Experienced CA with 15+ years in tax planning and GST compliance",
        hourlyRate: 2e3,
        rating: 49,
        totalReviews: 127,
        kycStatus: "approved",
        availability: {
          monday: ["10:00", "14:00", "16:00"],
          tuesday: ["10:00", "14:00", "16:00"],
          wednesday: ["10:00", "14:00", "16:00"],
          thursday: ["10:00", "14:00", "16:00"],
          friday: ["10:00", "14:00", "16:00"]
        }
      },
      {
        userId: insertedProfessionalUsers[1].id,
        registrationNumber: "CS789012",
        qualification: "CS",
        specializations: ["Company Law", "Compliance", "ROC Filing"],
        experience: 12,
        city: "Delhi",
        bio: "Expert CS specializing in company law and regulatory compliance",
        hourlyRate: 3500,
        rating: 48,
        totalReviews: 89,
        kycStatus: "approved",
        availability: {
          monday: ["09:00", "11:00", "15:00"],
          tuesday: ["09:00", "11:00", "15:00"],
          wednesday: ["09:00", "11:00", "15:00"],
          thursday: ["09:00", "11:00", "15:00"],
          friday: ["09:00", "11:00", "15:00"]
        }
      },
      {
        userId: insertedProfessionalUsers[2].id,
        registrationNumber: "CA345678",
        qualification: "CA",
        specializations: ["Financial Planning", "Investment Advisory", "Audit"],
        experience: 8,
        city: "Bangalore",
        bio: "Young and dynamic CA specializing in financial planning and investment advisory",
        hourlyRate: 1800,
        rating: 47,
        totalReviews: 56,
        kycStatus: "approved",
        availability: {
          monday: ["11:00", "15:00", "17:00"],
          tuesday: ["11:00", "15:00", "17:00"],
          wednesday: ["11:00", "15:00", "17:00"],
          thursday: ["11:00", "15:00", "17:00"],
          friday: ["11:00", "15:00", "17:00"]
        }
      }
    ];
    await db.insert(professionals).values(professionalProfiles);
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
if (process.env.NODE_ENV === "development") {
  seedDatabase();
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
