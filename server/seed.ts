import { db } from "./db";
import { users, professionals } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already seeded");
      return;
    }

    console.log("Seeding database...");

    // Seed admin user
    const [admin] = await db
      .insert(users)
      .values({
        email: "admin@complianceconnect.com",
        password: "$2b$10$hash", // In real app, would be properly hashed
        role: "admin",
        name: "System Admin",
        phone: "+91 9876543210",
        isVerified: true,
      })
      .returning();

    // Seed business user
    const [business] = await db
      .insert(users)
      .values({
        email: "business@example.com",
        password: "$2b$10$hash",
        role: "business",
        name: "ABC Private Limited",
        phone: "+91 9876543213",
        isVerified: true,
      })
      .returning();

    // Seed professional users and their profiles
    const professionalUsers = [
      {
        email: "rajesh.kumar@email.com",
        password: "$2b$10$hash",
        role: "professional" as const,
        name: "CA Rajesh Kumar",
        phone: "+91 9876543211",
        isVerified: true,
      },
      {
        email: "priya.sharma@email.com",
        password: "$2b$10$hash",
        role: "professional" as const,
        name: "CS Priya Sharma",
        phone: "+91 9876543212",
        isVerified: true,
      },
      {
        email: "vikash.singh@email.com",
        password: "$2b$10$hash",
        role: "professional" as const,
        name: "CA Vikash Singh",
        phone: "+91 9876543214",
        isVerified: true,
      },
    ];

    const insertedProfessionalUsers = await db
      .insert(users)
      .values(professionalUsers)
      .returning();

    // Create professional profiles
    const professionalProfiles = [
      {
        userId: insertedProfessionalUsers[0].id,
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
          monday: ["10:00", "14:00", "16:00"],
          tuesday: ["10:00", "14:00", "16:00"],
          wednesday: ["10:00", "14:00", "16:00"],
          thursday: ["10:00", "14:00", "16:00"],
          friday: ["10:00", "14:00", "16:00"],
        },
      },
      {
        userId: insertedProfessionalUsers[1].id,
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
          monday: ["09:00", "11:00", "15:00"],
          tuesday: ["09:00", "11:00", "15:00"],
          wednesday: ["09:00", "11:00", "15:00"],
          thursday: ["09:00", "11:00", "15:00"],
          friday: ["09:00", "11:00", "15:00"],
        },
      },
      {
        userId: insertedProfessionalUsers[2].id,
        registrationNumber: "CA345678",
        qualification: "CA" as const,
        specializations: ["Financial Planning", "Investment Advisory", "Audit"],
        experience: 8,
        city: "Bangalore",
        bio: "Young and dynamic CA specializing in financial planning and investment advisory",
        hourlyRate: 1800,
        rating: 47,
        totalReviews: 56,
        kycStatus: "approved" as const,
        availability: {
          monday: ["11:00", "15:00", "17:00"],
          tuesday: ["11:00", "15:00", "17:00"],
          wednesday: ["11:00", "15:00", "17:00"],
          thursday: ["11:00", "15:00", "17:00"],
          friday: ["11:00", "15:00", "17:00"],
        },
      },
    ];

    await db.insert(professionals).values(professionalProfiles);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Auto-seed on import if not in production
if (process.env.NODE_ENV === "development") {
  seedDatabase();
}