# Application Flow Documentation

## 1. Entry Points

### Direct URL
- `/` → Public landing page for the event.
- `/register` → Public registration form.
- `/login` → Admin login screen.
- `/verifier` → Verifier access page.
- `/admin/*` → Admin dashboard and admin feature pages (requires login).

### Deep Links
- Not currently implemented in the frontend.
- The app can accept deep links to any public or admin route directly via URL if the user is already authorized.
- Example deep links:
  - `/register`
  - `/admin/dashboard`
  - `/admin/events/manage`

### OAuth / Social Login Entry Points
- Not implemented.
- Current auth is a localStorage-based admin login flow with hardcoded credentials.

## 2. Core User Flows

### Public Event Discovery Flow
**Goal:** See event details and decide whether to register.
**Entry Point:** `/`

#### Happy Path
Step-by-step:
1. `Landing Page` → hero section, event highlights, speakers, venue → user reads details.
2. User clicks `Register Now` → app navigates to `/register`.
3. `Register Form` → user fills required fields and submits.
4. Form validates input → success message displays.
5. User remains on registration page with confirmation message.

#### Error States
- Invalid input → error text appears under email/mobile fields and form is not submitted.
- System error → not currently implemented, would show a generic alert.
- Network offline → not explicitly handled, but form submission is local and still completes in mock mode.

#### Edge Cases
- User abandons mid-flow → they can return to `/` or close the page.
- Session expires during flow → not applicable for public registration.
- User navigates back → browser back returns to the previous screen.

#### Exit Points
- Success destination → remains on `/register` with success state.
- Abandonment destination → user can return to `/` or close the page.

### Public Registration Flow
**Goal:** Register for the event.
**Entry Point:** `/register`

#### Happy Path
Step-by-step:
1. `Register Form` → fields displayed for name, email, mobile, designation, organisation, optional GST and membership.
2. User enters valid data and clicks `Register for Event`.
3. Validation succeeds → mock submit completes after a delay.
4. Success alert appears confirming registration.

#### Error States
- Invalid input → inline validation errors appear for name/email/mobile/designation/organisation.
- System error → not implemented, no explicit UI.
- Network offline → the current local mock submission does not require network, so no failure state is shown.

#### Edge Cases
- User abandons mid-flow → there is no autosave; the form state is lost when leaving the page.
- Session expires during flow → not applicable.
- User navigates back → browser back returns to `/` or previous screen.

#### Exit Points
- Success destination → same `/register` page with success alert.
- Abandonment destination → return to `/` or leave the page.

### Admin Login Flow
**Goal:** Authenticate as an administrator.
**Entry Point:** `/login`

#### Happy Path
Step-by-step:
1. `Login Page` → email/password inputs and sign-in button are displayed.
2. Admin enters `admin@gmail.com` / `123456` and submits.
3. App stores `adminToken`, `userRole`, and `userEmail` in localStorage.
4. User is redirected to `/admin/dashboard`.

#### Error States
- Invalid input → login error banner displays `Invalid email or password. Please try again.`
- System error → not implemented.
- Network offline → not implemented; auth is local.

#### Edge Cases
- User abandons mid-flow → no session is created.
- Session expires during flow → not implemented.
- User navigates back → browser navigation works normally.

#### Exit Points
- Success destination → `/admin/dashboard`.
- Abandonment destination → `/` or previous page.

### Admin Dashboard Flow
**Goal:** Access admin management tools and launch admin features.
**Entry Point:** `/admin/dashboard`

#### Happy Path
Step-by-step:
1. `Admin Layout` renders with a sidebar and top header.
2. `Dashboard` content shows statistics, action cards, and recent events.
3. User clicks a sidebar item, such as `Create Event` or `Manage Events`.
4. App navigates to the selected admin route and renders the corresponding page.

#### Error States
- Access denied → protected route redirects unauthenticated users to `/login`.
- System error → not implemented.
- Network offline → no explicit state, admin features use client-side routing.

#### Edge Cases
- User abandons mid-flow → can close the browser or navigate away.
- Session expires during flow → if `adminToken` is removed, next navigation to `/admin/*` redirects to `/login`.
- User navigates back → browser back returns to previous admin route.

#### Exit Points
- Success destination → chosen admin subpage, e.g. `/admin/events/manage`.
- Abandonment destination → `/login` if unauthorized, or `/` if leaving.

### Event Management Flow
**Goal:** Manage event creation, editing, and form access.
**Entry Point:** `/admin/events/create` or `/admin/events/manage`

#### Happy Path
Step-by-step:
1. User clicks `Create Event` or `Manage Events` in the admin sidebar.
2. App navigates to the selected route and renders the admin page.
3. User interacts with the form or event list.
4. Actions lead to event edit forms or event detail screens.

#### Error States
- Attempting admin route when not logged in → redirect to `/login`.
- Invalid event form input → not explicitly handled beyond page-level validation if implemented.
- System error → not implemented.

#### Edge Cases
- User abandons mid-edit → unsaved changes are not persisted.
- Session expires → route redirect to `/login` on next reload/navigation.
- User navigates back → returns to `/admin/dashboard` or previous admin page.

#### Exit Points
- Success destination → relevant admin page or list screen.
- Abandonment destination → `/admin/dashboard` or browser close.

### Registrations / Ticket Flow
**Goal:** Approve registrations and access ticket generation.
**Entry Point:** `/admin/registrations` or `/admin/tickets`

#### Happy Path
Step-by-step:
1. User selects the corresponding sidebar link.
2. The page renders registration or ticket UI.
3. User performs approval or ticket-related actions.

#### Error States
- Access blocked when unauthenticated → redirect to `/login`.
- System error → not implemented.
- Offline → not handled.

#### Edge Cases
- User abandons mid-review → no state is saved.
- User back navigates → returns to previous admin page.

#### Exit Points
- Success destination → remains on the current admin list page.
- Abandonment destination → `/admin/dashboard`.

### Verifier Flow
**Goal:** Access verifier functionality.
**Entry Point:** `/verifier`

#### Happy Path
Step-by-step:
1. User navigates to `/verifier`.
2. Verifier page loads and displays the verifier interface.
3. User consumes the page content or begins verification workflows.

#### Error States
- Not implemented for offline or system errors.

#### Edge Cases
- User abandons → returns to `/` or closes page.
- User navigates back → browser history returns to prior screen.

#### Exit Points
- Success destination → stays on `/verifier`.
- Abandonment destination → `/`.

## 3. Navigation Map

Home
├── Register
├── Login
├── Verifier
└── Admin
    ├── Dashboard
    ├── Events
    │   ├── Create Event
    │   ├── Manage Events
    │   ├── Edit Event
    │   └── Event Form
    ├── Registrations
    ├── Tickets
    └── Verifiers

## 4. Screen Inventory

### Home
- Route / URL: `/`
- Access level: Public
- Purpose: Present the event and CTA buttons for registration and membership.
- Key UI elements:
  - Hero title, event details, date badge
  - Register and Become a Member buttons
  - Tabs for overview, speakers, venue
  - Quick actions card
- Available actions:
  - `Register Now` → `/register`
  - `Become a Member` → external link
- State variants:
  - Default content state only.

### Register
- Route / URL: `/register`
- Access level: Public
- Purpose: Collect attendee registration details.
- Key UI elements:
  - Input fields for name, email, mobile, designation, organisation, GST, membership
  - Submit button
  - Validation messages
  - Success alert
- Available actions:
  - Submit form → local success state
  - Back button → `/`
- State variants:
  - Default form state
  - Error state for validation
  - Success state after submit

### Login
- Route / URL: `/login`
- Access level: Public
- Purpose: Authenticate admin users.
- Key UI elements:
  - Email/password fields
  - Remember me checkbox
  - Sign in button
  - Error alert
  - Admin credential hint
- Available actions:
  - Submit login → `/admin/dashboard` on success
  - Forgot password link → placeholder only
- State variants:
  - Default form state
  - Error state for invalid credentials

### Verifier
- Route / URL: `/verifier`
- Access level: Public
- Purpose: Provide access to the verifier interface.
- Key UI elements:
  - Verifier page content (not fully implemented in detail)
- Available actions:
  - User actions within verifier tool if present
- State variants:
  - Default state

### Admin Layout
- Route / URL: `/admin/*`
- Access level: Admin authenticated
- Purpose: Wrapper for all admin screens with sidebar and header navigation.
- Key UI elements:
  - Sidebar links
  - Header profile / logout
  - Outlet for admin content
- Available actions:
  - Navigate to admin subpages
  - Logout → `/login`
- State variants:
  - Sidebar open/closed for responsive behavior

### Dashboard
- Route / URL: `/admin/dashboard`
- Access level: Admin authenticated
- Purpose: Provide overview of events, registrations, and quick actions.
- Key UI elements:
  - Stats cards
  - Quick action cards
  - Recent events table
- Available actions:
  - Navigate to create/manage/registrations/tickets/verifiers
- State variants:
  - Default with event list
  - Empty state if no events exist

### Create Event
- Route / URL: `/admin/events/create`
- Access level: Admin authenticated
- Purpose: Add a new event.
- Key UI elements: event form fields, save controls
- Available actions: submit event form
- State variants: not fully implemented beyond form state

### Manage Events
- Route / URL: `/admin/events/manage`
- Access level: Admin authenticated
- Purpose: Review and manage existing events.
- Key UI elements: event list/table
- Available actions: edit event, view form, registrations, tickets
- State variants: default list state

### Edit Event
- Route / URL: `/admin/events/edit/:eventId`
- Access level: Admin authenticated
- Purpose: Modify event details.
- Key UI elements: edit form fields
- Available actions: save changes
- State variants: default form state

### Event Form
- Route / URL: `/admin/events/:eventId/form`
- Access level: Admin authenticated
- Purpose: Manage event-specific form details.
- Key UI elements: form fields
- Available actions: save or configure form
- State variants: default form state

### Registrations
- Route / URL: `/admin/registrations`
- Access level: Admin authenticated
- Purpose: Review and approve registrations.
- Key UI elements: approval list, buttons
- Available actions: approve/reject
- State variants: default list state

### Tickets
- Route / URL: `/admin/tickets`
- Access level: Admin authenticated
- Purpose: Generate ticketing information.
- Key UI elements: ticket creation controls
- Available actions: generate tickets
- State variants: default list state

### Verifiers
- Route / URL: `/admin/verifiers`
- Access level: Admin authenticated
- Purpose: Manage verifier accounts and validation workflows.
- Key UI elements: verifier list or create controls
- Available actions: add/edit verifiers
- State variants: default list state

## 5. Decision Points
- IF user is NOT logged in
  - THEN show `/login` when accessing `/admin/*`
- IF user is logged in with `adminToken`
  - THEN show admin dashboard and allow `/admin/*` navigation
- IF user clicks `Register Now`
  - THEN navigate to `/register`
- IF user clicks `Become a Member`
  - THEN open external membership URL

## 6. Error Handling Flows
- 404
  - Not currently implemented explicitly.
  - Fallback route redirects to `/`.
  - Available action: return to home.
- 500
  - Not currently implemented.
  - Application relies on client-side rendering and no explicit server error page.
- Network Offline
  - Not explicitly handled.
  - Public registration and admin navigation continue locally unless external APIs are added.
- Invalid Credentials
  - Login page shows error alert.
  - Recovery: correct credentials and resubmit.
- Invalid Form Input
  - Registration page shows inline validation errors.
  - Recovery: update invalid fields and resubmit.

## 7. Responsive Behavior
- Mobile-specific flows
  - Admin layout uses a collapsible sidebar hidden on small screens.
  - Mobile header includes a hamburger toggle for the sidebar.
  - Landing page buttons stack vertically on smaller screens.
- Desktop-specific flows
  - Admin sidebar is visible by default.
  - Dashboard cards display in multi-column layout.
  - Landing page uses a two-column content layout.
