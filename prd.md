# Product Requirements Document (PRD)

## 1. Product Overview
- Project Title: Event Management System (EMS) Frontend
- Version: 0.1.0 (MVP)
- Owner: EMS product team / frontend implementation lead

## 2. Problem Statement
Event organizers need a modern, responsive frontend to showcase events, capture registrations, and provide administrators with a centralized dashboard for managing events, ticketing, and verifier workflows. The current project solves the lack of a polished React + Bootstrap admin and event registration interface for managing conference-style events.

## 3. Goals & Objectives
- Business Goals
  - Provide a polished public-facing event landing page to drive registrations and event awareness.
  - Enable administrators to manage events, registrations, tickets, and verifiers from a unified admin dashboard.
  - Deliver a responsive React frontend that can be connected to backend services later.
- User Goals
  - As a visitor, I want a clear event overview and registration flow so I can sign up quickly.
  - As an admin, I want secure access to event management tools so I can create, edit, and review event activity.
  - As a verifier, I want a dedicated route to perform verification workflows.

## 4. Success Metrics
- 80% of admin workflow screens are available in the MVP.
- Public registration form completion within 2 minutes for a first-time user.
- Admin dashboard must render within 1 second on a standard desktop browser.
- Mobile layout should remain usable on screens down to 320px width.
- Zero runtime build errors for the current codebase.

## 5. Target Users & Personas
- Persona 1: Event Attendee
  - Demographics: Professionals, students, or tech enthusiasts interested in conferences.
  - Pain Points: Difficulty finding event details, unclear registration flow.
  - Goals: Quickly view event highlights, register with minimal friction.
  - Technical proficiency: Basic web literacy.

- Persona 2: Event Administrator
  - Demographics: Organizers and operations staff who manage events.
  - Pain Points: Disjointed or manual event management tools, hard-to-use dashboards.
  - Goals: Easily create and manage events, review registrations, generate tickets, and configure verifiers.
  - Technical proficiency: Intermediate web user.

- Persona 3: Verifier / Support Staff
  - Demographics: Personnel tasked with validating attendees and tickets.
  - Pain Points: Lack of a streamlined verification interface.
  - Goals: Access a dedicated verification page and perform checks quickly.
  - Technical proficiency: Basic to intermediate.

## 6. Features & Requirements
### P0 — Must Have (MVP)
- Public Landing Page
  - Description: A polished event landing page with hero messaging, event highlights, speakers, venue details, and CTA buttons.
  - User Story: As a visitor, I want to understand the event and register so that I can attend.
  - Acceptance Criteria:
    - [ ] Page renders successfully at `/`.
    - [ ] Hero section includes event title, date, description, and CTA buttons.
    - [ ] Tabs or section cards present event overview, speakers, and venue details.
    - [ ] "Register Now" button navigates to `/register`.
  - Success Metric: 90% of landing page elements display correctly on desktop and mobile.

- Registration Form
  - Description: A responsive registration form with validation for name, email, mobile, designation, organization, GST, and membership.
  - User Story: As a visitor, I want to submit my event registration so that I can reserve a ticket.
  - Acceptance Criteria:
    - [ ] Page available at `/register`.
    - [ ] Required fields validate before submission.
    - [ ] Success message displays after submission.
    - [ ] Form submission logs the registration details in console/mock state.
  - Success Metric: Validation catches invalid email and mobile input 100% of the time.

- Admin Login
  - Description: Admin sign-in screen with credential check and localStorage-based auth state.
  - User Story: As an admin, I want to log in securely so that I can access management tools.
  - Acceptance Criteria:
    - [ ] Page available at `/login`.
    - [ ] Only valid admin credentials allow access.
    - [ ] Invalid credentials show an error message.
    - [ ] Successful login stores `adminToken` in localStorage.
  - Success Metric: Login route secured by protected routing.

- Admin Dashboard Layout
  - Description: Responsive admin shell with sidebar navigation, header, and main content outlet.
  - User Story: As an admin, I want a consistent dashboard layout so I can navigate management pages.
  - Acceptance Criteria:
    - [ ] Sidebar contains links to dashboard, event creation, event management, registrations, tickets, and verifiers.
    - [ ] Header includes logout and profile actions.
    - [ ] Layout adapts for mobile screens.
  - Success Metric: Sidebar navigation remains functional on mobile.

- Event Management Pages
  - Description: Admin pages to create and manage event details.
  - User Story: As an admin, I want to add and update events so that attendees can register.
  - Acceptance Criteria:
    - [ ] Create event page available at `/admin/events/create`.
    - [ ] Manage events page available at `/admin/events/manage`.
    - [ ] Edit and form routes exist for event actions.
  - Success Metric: Admin can navigate to all event management routes successfully.

- Registrations & Tickets
  - Description: Admin workflow pages for reviewing registrations and generating tickets.
  - User Story: As an admin, I want to approve registrations and generate tickets so that attendees receive confirmations.
  - Acceptance Criteria:
    - [ ] Registrations page available at `/admin/registrations`.
    - [ ] Tickets page available at `/admin/tickets`.
    - [ ] UI supports action buttons for approvals and ticket generation.
  - Success Metric: Pages render without JS errors and show actionable buttons.

- Verifier Page
  - Description: A dedicated verifier route for staff validation workflows.
  - User Story: As a verifier, I want a verification page so I can validate event entries.
  - Acceptance Criteria:
    - [ ] Page available at `/verifier`.
    - [ ] Navigation from landing page exists.
  - Success Metric: Verifier route loads successfully in the app.

### P1 — Should Have
- Event summary cards on admin dashboard with metrics and quick action links.
- Recent events list with status badges and action buttons.
- Landing page membership CTA and external navigation to partner site.
- Admin profile display from stored user email.

### P2 — Nice to Have
- Full backend integration for persistence and authentication.
- Real ticket download/export functionality.
- Role-based access beyond admin vs public.
- Analytics charts and reporting pages.

## 7. Explicitly OUT OF SCOPE
- Building a backend API or database persistence layer.
- Implementing production-grade authentication and authorization beyond localStorage mock auth.
- Real payment, checkout, or ticket issuance systems.
- Email delivery, confirmation workflows, and server-side receipts.

## 8. User Scenarios
- Scenario 1: Visitor discovers and registers
  - Context: A user lands on the EMS homepage to evaluate the event.
  - Steps:
    1. Open `/`.
    2. Review event details and highlights.
    3. Click "Register Now".
    4. Complete and submit the registration form.
  - Expected Outcome: User sees registration success confirmation.
  - Edge Cases: Invalid email/mobile input returns form validation errors.

- Scenario 2: Admin logs in and manages events
  - Context: Admin needs to update event details before launch.
  - Steps:
    1. Navigate to `/login`.
    2. Enter `admin@gmail.com` / `123456`.
    3. Submit login form.
    4. Access `/admin/dashboard`.
    5. Navigate to create/manage event pages via sidebar.
  - Expected Outcome: Admin can access protected admin routes and navigate management pages.
  - Edge Cases: Incorrect credentials show an error and block access.

- Scenario 3: Verifier accesses their tool
  - Context: A verifier needs a dedicated interface for attendance verification.
  - Steps:
    1. Navigate to `/verifier`.
    2. Use verifier page controls to perform checks.
  - Expected Outcome: Verifier page loads and can be used for future verification workflows.
  - Edge Cases: No data on page may require placeholder messaging or empty state.

## 9. Dependencies & Constraints
- Technical constraints:
  - Built with React 19.2.5 and Vite 8.0.10.
  - Uses Bootstrap 5.3.x, React Bootstrap, React Router DOM 6.x.
  - LocalStorage-based auth and mock data flows.
- Business constraints:
  - MVP must focus on frontend polish over backend integration.
  - Must be deliverable without a server component.
- External dependencies:
  - Bootstrap icons and Font Awesome classes used in the UI.
  - Future backend or API services will be required for real persistence.

## 10. Timeline & Milestones
- MVP Date: Immediately achievable with current frontend implementation.
  - Included: public landing page, registration form, admin login, dashboard shell, event management routes, registrations, tickets, verifiers.
- V1.0 Date: next iteration after backend integration and data persistence.
  - Included: API integration, real auth, ticket export, reporting charts, role-based access.

## 11. Non-Functional Requirements
- Performance: Pages should render within 1 second on desktop and under 2 seconds on mobile.
- Security: Protect admin routes via client-side protected routing and avoid exposing admin paths to unauthenticated users.
- Accessibility: Use semantic form labels, keyboard-navigable buttons, and responsive layout.
- Scalability: Architecture should support addition of backend APIs and more admin modules without refactoring the routing structure.
