import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProfessionalSchema, insertBookingSchema, insertMessageSchema, insertRequirementSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, you would generate and return a JWT token here
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token: "mock-jwt-token" });
    } catch (error) {
      res.status(400).json({ message: "Invalid login data", error });
    }
  });

  // User routes
  app.get("/api/users/me", async (req, res) => {
    // In a real app, you would verify JWT token here
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Mock token verification - in real app you'd decode JWT
    const userId = req.headers['x-user-id'] as string;
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

  // Professional routes
  app.post("/api/professionals", async (req, res) => {
    try {
      const professionalData = insertProfessionalSchema.parse(req.body);
      const professional = await storage.createProfessional(professionalData);
      res.status(201).json(professional);
    } catch (error) {
      res.status(400).json({ message: "Invalid professional data", error });
    }
  });

  app.get("/api/professionals", async (req, res) => {
    try {
      const { specialization, city } = req.query;
      
      let professionals = await storage.getAllProfessionals();
      
      if (specialization) {
        professionals = professionals.filter(prof => 
          prof.specializations?.includes(specialization as string)
        );
      }
      
      if (city) {
        professionals = professionals.filter(prof => prof.city === city);
      }

      // Get user details for each professional
      const professionalsWithUsers = await Promise.all(
        professionals.map(async (prof) => {
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

  app.get("/api/professionals/:id", async (req, res) => {
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

  app.put("/api/professionals/:id/kyc", async (req, res) => {
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

  // Service routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      
      // Get professional and user details for each service
      const servicesWithDetails = await Promise.all(
        services.map(async (service) => {
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

  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: "Invalid booking data", error });
    }
  });

  app.get("/api/bookings/business/:businessId", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByBusiness(req.params.businessId);
      
      // Get service and professional details
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
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

  app.get("/api/bookings/professional/:professionalId", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByProfessional(req.params.professionalId);
      
      // Get service and business user details
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
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

  app.put("/api/bookings/:id", async (req, res) => {
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

  // Message routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data", error });
    }
  });

  app.get("/api/messages/booking/:bookingId", async (req, res) => {
    try {
      const messages = await storage.getMessagesByBooking(req.params.bookingId);
      
      // Get sender details for each message
      const messagesWithSenders = await Promise.all(
        messages.map(async (message) => {
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

  // Requirement routes
  app.post("/api/requirements", async (req, res) => {
    try {
      const requirementData = insertRequirementSchema.parse(req.body);
      const requirement = await storage.createRequirement(requirementData);
      res.status(201).json(requirement);
    } catch (error) {
      res.status(400).json({ message: "Invalid requirement data", error });
    }
  });

  app.get("/api/requirements", async (req, res) => {
    try {
      const requirements = await storage.getAllRequirements();
      
      // Get business user details for each requirement
      const requirementsWithUsers = await Promise.all(
        requirements.map(async (req) => {
          const user = await storage.getUser(req.businessId);
          return {
            ...req,
            businessUser: user ? { id: user.id, name: user.name } : null
          };
        })
      );

      res.json(requirementsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching requirements", error });
    }
  });

  app.get("/api/requirements/business/:businessId", async (req, res) => {
    try {
      const requirements = await storage.getRequirementsByBusiness(req.params.businessId);
      res.json(requirements);
    } catch (error) {
      res.status(500).json({ message: "Error fetching requirements", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
