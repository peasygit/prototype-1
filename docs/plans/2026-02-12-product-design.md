# Peasy Product Design & Architecture
Date: 2026-02-12
Status: Draft
Author: Assistant (Trae)

## Overview
Peasy is a hybrid platform for domestic helper recruitment that combines the ease of self-service discovery with the security and compliance of a managed hiring process.

**Key Philosophy**:
- **Discovery**: Open and transparent (like Tinder/LinkedIn).
- **Matching**: Admin-assisted (Concierge service for interviews).
- **Hiring**: Fully guided and compliant (Digital contracts & Visa processing).

## 1. User Flows

### A. Registration & Onboarding
1.  **Employer**:
    -   Sign up via Email/Password or Social Login.
    -   Complete Profile: Household size, location, specific care needs (elderly/child), lifestyle preferences.
    -   Create Job Post: Salary range, start date, required skills.
2.  **Helper**:
    -   Sign up via Email/Password.
    -   Complete Profile: Experience, skills, bio, upload verification documents.
    -   Upload Introduction Video (optional but recommended).

### B. Discovery & Matching
1.  **Employer View**:
    -   Browse Helper profiles with filters (Experience, Nationality, Skills).
    -   View detailed profiles (Skills, Work History, Video Intro).
    -   **Action**: "Shortlist" or "Request Interview".
2.  **Helper View**:
    -   Browse Job posts with filters (Location, Salary, Household type).
    -   View detailed job descriptions.
    -   **Action**: "Apply" or "Save".

### C. Interview Process (Manual Execution)
*Constraint: Video interviews are coordinated and executed by Admins.*

1.  **Request**: Employer clicks "Request Interview" on a Helper profile.
2.  **Coordination**:
    -   System notifies Admin Dashboard of the request.
    -   Admin contacts Helper (via WhatsApp/Phone) to confirm interest and availability.
    -   Admin contacts Employer to finalize time.
3.  **Execution**:
    -   Admin schedules the video call (Zoom/Google Meet/Peasy Video) and sends links to both parties manually or via platform message.
    -   Admin hosts/moderates the session to ensure quality and safety.
4.  **Feedback**:
    -   Post-interview, Admin updates the system status: `Interviewed`.
    -   Employer decides: `Offer`, `Second Interview`, or `Pass`.

### D. Hiring & Contracts
1.  **Offer**: Employer submits an offer through the platform (Salary, Start Date, Off-days).
2.  **Acceptance**: Helper reviews and accepts the offer.
3.  **Contract Generation**:
    -   System generates standard Employment Contract (e.g., ID 407 form data) based on agreed terms.
4.  **Signing**: Digital signatures (DocuSign integration or internal).
5.  **Payment**: Employer pays processing fees via Stripe.
6.  **Visa Processing**: Admin takes over for government submission; status updates tracked on platform.

## 2. System Architecture

### Frontend
-   **Framework**: Next.js 14+ (App Router)
-   **Styling**: Tailwind CSS v4
-   **State Management**: React Context / Hooks
-   **Components**: Reusable UI library (shadcn/ui compatible pattern)

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database ORM**: Prisma
-   **Database**: PostgreSQL
-   **API Structure**: RESTful API
    -   `/api/auth`: Authentication
    -   `/api/employers`: Employer profiles & actions
    -   `/api/helpers`: Helper profiles & actions
    -   `/api/jobs`: Job postings
    -   `/api/matches`: Matching logic & status tracking
    -   `/api/admin`: Admin dashboard endpoints

### Database Schema (Key Models)
*Ref: `backend/prisma/schema.prisma`*

-   `User`: Core authentication entity.
-   `Employer` / `Helper`: Profile extensions.
-   `Job`: Job posting details.
-   `Match`: Links Employer/Job to Helper. Tracks `status` (pending, interviewed, hired).
-   `Contract`: (To be added) Stores contract terms and status.

## 3. Implementation Roadmap

### Phase 1: Foundation (Current Status)
-   [x] Project Setup (Next.js + Express)
-   [x] Database Schema (Prisma)
-   [x] Basic Auth (Login/Register)
-   [x] Helper Dashboard & Profile
-   [x] Employer Dashboard (Matches View)

### Phase 2: Discovery & Matching (Next Priority)
-   [ ] **Employer Discovery Page**: Search/Filter Helpers.
-   [ ] **Helper Job Board**: Search/Filter Jobs.
-   [ ] **Match Action**: "Request Interview" button implementation.
-   [ ] **Admin Dashboard**: View pending interview requests.

### Phase 3: Hiring & Contracts
-   [ ] **Offer System**: Form to submit offer terms.
-   [ ] **Contract Generation**: PDF generation from data.
-   [ ] **Status Tracking**: Visa processing timeline.

### Phase 4: Polish & Launch
-   [ ] UI/UX Refinement (using `ui-ux-pro-max` guidelines).
-   [ ] Mobile Responsiveness check.
-   [ ] Security Audit.
