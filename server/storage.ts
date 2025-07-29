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
  type InsertRequirement
} from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private professionals: Map<string, Professional> = new Map();
  private services: Map<string, Service> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private messages: Map<string, Message> = new Map();
  private requirements: Map<string, Requirement> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed admin user
    const adminId = randomUUID();
    const admin: User = {
      id: adminId,
      email: "admin@complianceconnect.com",
      password: "$2b$10$hash", // In real app, would be properly hashed
      role: "admin",
      name: "System Admin",
      phone: "+91 9876543210",
      isVerified: true,
      createdAt: new Date(),
    };
    this.users.set(adminId, admin);

    // Seed some professional users and their profiles
    const professionals = [
      {
        user: {
          email: "rajesh.kumar@email.com",
          password: "$2b$10$hash",
          role: "professional" as const,
          name: "CA Rajesh Kumar",
          phone: "+91 9876543211",
          isVerified: true,
        },
        professional: {
          registrationNumber: "CA123456",
          qualification: "CA" as const,
          specializations: ["Tax Planning", "GST Returns", "Audit"],
          experience: 15,
          city: "Mumbai",
          bio: "Experienced CA with 15+ years in tax planning and GST compliance",
          hourlyRate: 2000,
          rating: 49,
          totalReviews: 127,
          kycStatus: "approved" as const,
          availability: {
            "monday": ["10:00", "14:00", "16:00"],
            "tuesday": ["10:00", "14:00", "16:00"],
            "wednesday": ["10:00", "14:00", "16:00"],
            "thursday": ["10:00", "14:00", "16:00"],
            "friday": ["10:00", "14:00", "16:00"],
          }
        }
      },
      {
        user: {
          email: "priya.sharma@email.com",
          password: "$2b$10$hash",
          role: "professional" as const,
          name: "CS Priya Sharma",
          phone: "+91 9876543212",
          isVerified: true,
        },
        professional: {
          registrationNumber: "CS789012",
          qualification: "CS" as const,
          specializations: ["Company Law", "Compliance", "ROC Filing"],
          experience: 12,
          city: "Delhi",
          bio: "Expert CS specializing in company law and regulatory compliance",
          hourlyRate: 3500,
          rating: 48,
          totalReviews: 89,
          kycStatus: "approved" as const,
          availability: {
            "monday": ["09:00", "11:00", "15:00"],
            "tuesday": ["09:00", "11:00", "15:00"],
            "wednesday": ["09:00", "11:00", "15:00"],
            "thursday": ["09:00", "11:00", "15:00"],
            "friday": ["09:00", "11:00", "15:00"],
          }
        }
      },
      {
        user: {
          email: "vikash.singh@email.com",
          password: "$2b$10$hash",
          role: "professional" as const,
          name: "CA Vikash Singh",
          phone: "+91 9876543213",
          isVerified: true,
        },
        professional: {
          registrationNumber: "CA345678",
          qualification: "CA" as const,
          specializations: ["Startup CFO", "Financial Planning", "Investment"],
          experience: 8,
          city: "Bangalore",
          bio: "Young CA focused on startup financial management and investment advisory",
          hourlyRate: 1500,
          rating: 47,
          totalReviews: 64,
          kycStatus: "pending" as const,
          availability: {
            "monday": ["10:00", "14:00", "18:00"],
            "tuesday": ["10:00", "14:00", "18:00"],
            "wednesday": ["10:00", "14:00", "18:00"],
            "thursday": ["10:00", "14:00", "18:00"],
            "friday": ["10:00", "14:00", "18:00"],
          }
        }
      }
    ];

    professionals.forEach(({ user, professional }) => {
      const userId = randomUUID();
      const professionalId = randomUUID();
      
      const fullUser: User = {
        id: userId,
        createdAt: new Date(),
        ...user,
      };
      
      const fullProfessional: Professional = {
        id: professionalId,
        userId,
        ...professional,
      };

      this.users.set(userId, fullUser);
      this.professionals.set(professionalId, fullProfessional);

      // Add some services for each professional
      const services = [
        {
          title: "Tax Consultation",
          description: "Comprehensive tax planning and advisory services",
          category: "Tax",
          price: professional.hourlyRate,
          duration: 60,
        },
        {
          title: "GST Return Filing",
          description: "Monthly GST return preparation and filing",
          category: "GST",
          price: professional.hourlyRate * 2,
          duration: 120,
        }
      ];

      services.forEach(service => {
        const serviceId = randomUUID();
        const fullService: Service = {
          id: serviceId,
          professionalId,
          isActive: true,
          ...service,
        };
        this.services.set(serviceId, fullService);
      });
    });

    // Seed a business user
    const businessId = randomUUID();
    const businessUser: User = {
      id: businessId,
      email: "business@example.com",
      password: "$2b$10$hash",
      role: "business",
      name: "Business Owner",
      phone: "+91 9876543214",
      isVerified: true,
      createdAt: new Date(),
    };
    this.users.set(businessId, businessUser);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Professional operations
  async getProfessional(id: string): Promise<Professional | undefined> {
    return this.professionals.get(id);
  }

  async getProfessionalByUserId(userId: string): Promise<Professional | undefined> {
    return Array.from(this.professionals.values()).find(prof => prof.userId === userId);
  }

  async createProfessional(insertProfessional: InsertProfessional): Promise<Professional> {
    const id = randomUUID();
    const professional: Professional = { ...insertProfessional, id };
    this.professionals.set(id, professional);
    return professional;
  }

  async updateProfessional(id: string, updates: Partial<Professional>): Promise<Professional | undefined> {
    const professional = this.professionals.get(id);
    if (!professional) return undefined;
    
    const updatedProfessional = { ...professional, ...updates };
    this.professionals.set(id, updatedProfessional);
    return updatedProfessional;
  }

  async getAllProfessionals(): Promise<Professional[]> {
    return Array.from(this.professionals.values());
  }

  async getProfessionalsBySpecialization(specialization: string): Promise<Professional[]> {
    return Array.from(this.professionals.values()).filter(prof => 
      prof.specializations?.includes(specialization)
    );
  }

  // Service operations
  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = { ...insertService, id, isActive: true };
    this.services.set(id, service);
    return service;
  }

  async getServicesByProfessional(professionalId: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => 
      service.professionalId === professionalId && service.isActive
    );
  }

  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.isActive);
  }

  // Booking operations
  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { 
      ...insertBooking, 
      id,
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBookingsByBusiness(businessId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => 
      booking.businessId === businessId
    );
  }

  async getBookingsByProfessional(professionalId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => 
      booking.professionalId === professionalId
    );
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, ...updates };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Message operations
  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = { 
      ...insertMessage, 
      id,
      sentAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesByBooking(bookingId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.bookingId === bookingId)
      .sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
  }

  // Requirement operations
  async getRequirement(id: string): Promise<Requirement | undefined> {
    return this.requirements.get(id);
  }

  async createRequirement(insertRequirement: InsertRequirement): Promise<Requirement> {
    const id = randomUUID();
    const requirement: Requirement = { 
      ...insertRequirement, 
      id,
      createdAt: new Date(),
    };
    this.requirements.set(id, requirement);
    return requirement;
  }

  async getRequirementsByBusiness(businessId: string): Promise<Requirement[]> {
    return Array.from(this.requirements.values()).filter(req => 
      req.businessId === businessId
    );
  }

  async getAllRequirements(): Promise<Requirement[]> {
    return Array.from(this.requirements.values());
  }
}

export const storage = new MemStorage();
