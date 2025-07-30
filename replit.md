# ComplianceConnect - Full-Stack Professional Services Platform

## Overview

ComplianceConnect is a full-stack web application that connects businesses with certified Chartered Accountants (CA) and Company Secretaries (CS) professionals. The platform facilitates service discovery, booking management, real-time messaging, and compliance workflow management across India.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for development and production builds
- **Authentication**: Context-based authentication with JWT tokens

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API architecture
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL storage

### Database Design
- **Primary Database**: PostgreSQL (Production Database Integrated)
- **Connection**: Neon Database serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Type Safety**: Drizzle-Zod integration for runtime type validation
- **Data Storage**: DatabaseStorage class replaces in-memory storage
- **Auto-seeding**: Development database automatically seeded with demo data

## Key Components

### Authentication System
- **Multi-role Support**: Supports business users, professionals, and administrators
- **Registration Flow**: Role-based registration with different data requirements
- **Session Management**: Server-side session storage with PostgreSQL
- **Protected Routes**: Route-level authentication guards

### User Management
- **User Types**: Business owners, CA/CS professionals, and platform administrators
- **Profile Management**: Role-specific profile information and settings
- **KYC Verification**: Document verification system for professionals

### Service Discovery
- **Professional Listings**: Searchable directory of verified professionals
- **Filtering**: Search by specialization, location, experience, and ratings
- **Service Catalog**: Professional-defined services with pricing and descriptions

### Booking System
- **Appointment Scheduling**: Calendar-based booking with availability management
- **Service Selection**: Multiple service types per professional
- **Payment Integration**: Pricing calculation with platform fees and GST
- **Status Tracking**: Booking lifecycle management (pending, confirmed, completed)

### Messaging System
- **Real-time Communication**: Booking-based messaging between users and professionals
- **Message History**: Persistent conversation storage
- **File Attachments**: Support for document sharing (planned)

### Administrative Dashboard
- **User Management**: Admin oversight of all platform users
- **Professional Verification**: KYC document review and approval
- **Platform Analytics**: Revenue tracking and user statistics
- **Content Moderation**: Review and approval workflows

## Data Flow

### User Registration and Authentication
1. User selects role (business/professional/admin) on registration
2. Role-specific form data collection and validation
3. Server-side user creation with password hashing
4. Session creation and JWT token generation
5. Client-side authentication state management

### Service Discovery and Booking
1. Business users browse professional listings with filtering
2. Professional profile views with service catalog
3. Booking modal with service selection and scheduling
4. Payment calculation and booking confirmation
5. Real-time updates via React Query cache invalidation

### Professional Onboarding
1. Professional registration with credential verification
2. KYC document upload and admin review
3. Service catalog creation and pricing setup
4. Availability calendar configuration
5. Profile activation upon approval

### Messaging Workflow
1. Booking-initiated conversations between parties
2. Real-time message polling (3-second intervals)
3. Message persistence with booking context
4. Notification system integration (planned)

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for state management
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS for utility-first styling
- **Forms**: React Hook Form with Zod validation

### Backend Dependencies
- **Database**: Drizzle ORM with PostgreSQL driver
- **Authentication**: Express sessions with connect-pg-simple
- **Validation**: Zod for runtime type checking
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build System**: Vite with React plugin and error overlay
- **TypeScript**: Full type safety across frontend and backend
- **Code Quality**: ESLint and Prettier configuration (implied)
- **Database Management**: Drizzle Kit for schema migrations

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR (Hot Module Replacement)
- **Backend Development**: tsx for TypeScript execution with auto-restart
- **Database**: Neon Database serverless PostgreSQL for development

### Production Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Static Assets**: Express serves built frontend from `dist/public`
4. **Database Migrations**: Drizzle Kit manages schema updates

### Production Architecture
- **Single Server Deployment**: Express serves both API and static files
- **Database**: Managed PostgreSQL via Neon Database
- **Asset Serving**: Express static file serving for production builds
- **Environment Configuration**: Environment variables for database and secrets

### Scalability Considerations
- **Database Connection Pooling**: Neon serverless PostgreSQL handles connection management
- **Session Storage**: PostgreSQL-backed sessions for horizontal scaling
- **API Caching**: React Query provides client-side caching
- **Static Asset CDN**: Ready for CDN integration for asset delivery