/*
	Blueprint for RHIVE Quantum OS: Building the Employee World (World 3)

1.0 Introduction: The Mandate for the Employee World

The Employee World, designated as World 3 within the RHIVE Quantum Operating System (QOS), serves as the central nervous system for internal operations. Its primary mandate is to function as the nexus for workflow management and sales motivation, directly translating the 10-stage customer journey into measurable financial outcomes. This world is architected on a foundational philosophy of "gamification" and is governed by strict logic gates designed to drive performance, prioritize revenue-generating activities, and prevent critical errors. The following blueprint outlines the non-negotiable design principles and phased build protocol required to construct this vital component of the QOS, starting with the foundational aesthetic that defines its unique identity.

2.0 Core Design Directives: The "Tech-Noir" Aesthetic

All components, pages, and interactive elements within the Employee World must adhere to a strict, non-negotiable set of design and aesthetic principles derived from the master RHIVE design system. This "Tech-Noir" theme is not merely a visual preference but a functional requirement, designed to create an immersive, high-focus environment that minimizes distraction and maximizes workflow efficiency.

The core aesthetic is a fusion of futuristic, high-contrast visuals, glassmorphism, and animated circuitry patterns. The design language must immediately communicate the "Futuristic AI" brand identity, creating an environment that is dark, immersive, and punctuated by glowing accents that guide user interaction.

Table 1: Core Design Tokens

Attribute	Value
Primary Color	RHIVE Pink (#ec028b)
UI Font	Rubik
Icon Library	Lucide-React

Key interface components are standardized to ensure visual and functional consistency:

* Circuitry Background: This is a mandatory, reusable component (CircuitryBackground.tsx) that must be applied as the root background for all pages in this world. It renders an animated HTML5 canvas of pulsing, neural network-like lines rendered in RHIVE Pink against a pure black (#000000) background. The animation must be active, creating a sense of depth and energy.
* Glassmorphic Cards: All UI content, including widgets, forms, and data displays, must be contained within "frosted glass" style cards. This effect is achieved using Tailwind's backdrop-blur utility. These cards serve as the primary containers, appearing to float over the animated circuitry background to create a distinct visual hierarchy and focal point for the user.

These design directives provide the foundation for the specific build instructions for the first core page of the Employee World.

3.0 Phase 1 Build: The Employee Pipeline (Page ID: E-02)

The Employee Pipeline (E-02) is architected as the primary workflow management tool for the sales team, providing a canonical, visual representation of the 10-stage customer journey from initial contact to project completion. Its function is to streamline project tracking and enforce operational discipline. The following agent directive provides the exact instructions for constructing this page and its associated components.

3.1 Agent Directive: Frontend-Design

Build the Employee World Pipeline (E-02) and Income Actionator (E-17).

**Aesthetic:** Tech-Noir. Use the CircuitryBackground.tsx component for the page background. All content must be within Glassmorphic cards.

**Page Function:** Sales motivation and workflow management.

**Component 1: The Pipeline (E-02)**
- **Layout:** Create a Kanban-style board interface.
- **Columns:** The board must have exactly 10 columns, representing the 10-stage customer journey: Lead -> Estimate -> Quote -> Sign -> Schedule -> Pre-Install -> Install -> Punch-list -> Invoicing -> Completed.
- **Cards:** Each project in the pipeline should be represented by a draggable card.
- **Data:** Cards must display key project data, including customer name, project value, and current stage.

**Component 2: The Income Actionator (E-17)**
- **Layout:** Create a task list dashboard widget.
- **Sorting Logic:** The task list must NOT be sorted by date. It must be sorted by `project_value` in descending order. This is the "Income Actionator" philosophy: prioritize the highest dollar-impact tasks.
- **Gamification:** Include a large, glowing ticker component at the top of the dashboard that displays "Net Potential Commission" based on the projects in the pipeline. Use a RHIVE Pink glow effect on the text.

**State Management:** Connect the components to a Zustand store to manage the state of projects and tasks.


3.2 Analysis of Expected Output

Upon completion, the agent's artifact should display a fully functional Kanban board interface set against the immersive, animated circuitry background. The user must verify the presence of exactly 10 columns, each corresponding to a stage in the customer journey, with draggable project cards displaying essential data. Visually, the entire interface must conform to the 'Tech-Noir' aesthetic, leveraging the Glassmorphic cards to create a high-focus 'heads-up display' environment that minimizes distraction and maximizes workflow efficiency. This phase establishes the core operational tool, setting the stage for the next critical component: the gamified motivational engine.

4.0 Phase 2 Build: The Income Actionator (Page ID: E-17)

The Income Actionator (E-17) is a cornerstone of the Employee World's gamified approach to sales performance. Its core philosophy is to fundamentally shift the user's focus from a traditional, chronological task list to a revenue-centric prioritization model, hard-wiring a connection between daily effort and financial outcome. By explicitly linking daily tasks to direct earning potential via a prominent commission tracker, the component is designed to maximize motivation and ensure effort is consistently applied to the most financially impactful activities.

4.1 Functional Requirements Breakdown

The build must satisfy the following critical requirements derived from the agent directive:

1. Task Prioritization Logic: The primary functional mandate is that the task list must not be sorted chronologically. It is to be sorted exclusively by the project_value field in descending order. This implementation reinforces the core philosophy: "the highest dollar-impact tasks must appear at the top."
2. Gamified Commission Ticker: To drive motivation, the component must feature a large, visually prominent "Net Potential Commission" ticker. This element must be styled with a RHIVE Pink glow effect to draw the user's attention and provide a real-time, visual reward that connects their pipeline directly to potential earnings.
3. UI/UX: The Income Actionator must be constructed as a dashboard widget contained within a Glassmorphic card. This ensures its visual integration with the established design system of the Employee World, maintaining a cohesive and immersive user experience.

With these components built, a rigorous verification process is required to ensure both functional and aesthetic compliance.

5.0 Verification & Quality Assurance Protocol

After an AI agent completes a build task, the user assumes the critical role of Quality Assurance (QA) gatekeeper. The generated "Artifacts"—which may include implementation plans, screenshots, or video walkthroughs—must be meticulously reviewed. This protocol is essential to validate that the output is not only functionally correct but also fully compliant with the mandated "Tech-Noir" aesthetic.

5.1 The Artifact Review Checklist

Use the following checklist to conduct a thorough review of the agent's submitted work.

* [ ] Task List Review: Does the agent's task list accurately reflect the requirements specified in the prompt?
* [ ] Implementation Plan Review: Does the proposed file and directory structure logically separate the different components of the Employee World?
* [ ] Walkthrough/Screenshot Review (Critical): Does the visual proof of work (video or screenshot) demonstrate a fully functional and aesthetically correct interface? Specifically, is the Kanban board rendering correctly and is the task list sorted by project value?
* [ ] Aesthetic Compliance Check: Does the interface correctly implement the CircuitryBackground component? Are the cards properly styled with the 'Glassmorphism' effect? Is the RHIVE Pink color used for highlights and glows as mandated?

5.2 Example Feedback Directive

If an artifact fails the aesthetic compliance check, provide clear, actionable feedback to the agent. The following is an example of a directive to correct a common design deviation.

"The design is too flat. Apply the CircuitryBackground component to the page root and ensure all widgets use the Glassmorphic card style with the specified backdrop-blur. Increase the neon glow intensity on the commission ticker to match the Tech-Noir requirements."

Following this blueprint and its verification protocols will ensure the successful construction of the Employee World, a core component of the RHIVE Quantum OS.

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  User Type	Page ID	PAGE FUNCTION	Priority	Description / Purpose	Key Features / Elements	Build Status	User Story (As a... I want to... So that...)	Acceptance Criteria (What = Done)	Test Status	Notes / Dependencies
About Us	PUBLIC	P-01	MISSION, VISION & VALUES	High	A brand-centric page establishing RHIVE's ""Tech-Noir"" identity. It communicates the ""Why"" (Transparency/Integrity), introduces the Founders (Kara & Michael), and displays the Core Values to build immediate trust with visitors.	- Hero Section (""FINISH ON TOP""); - Mission & Vision Cards; - Core Values Grid (Transparency, Integrity, Community); - Founders Section with bios and photos; - ""Contact Leadership"" CTA button.	To Do	- As a visitor, I want to know who runs the company so I know it's not a scam; - As a customer, I want to understand RHIVE's core values; - As a user, I want to see the mission statement.	- Page renders with ""Tech-Noir"" theme (Black/Pink); - Mission/Vision text matches RHIVE DATA; - Founders' names and contact info are correct; - ""Contact"" button links to P-05.	Pending	- Dependency: Brand Assets (Logos); - Dependency: Founders' Photos.
Our Services	PUBLIC	P-02	RESIDENTIAL & COMMERCIAL SOLUTIONS	High	A comprehensive catalog of capabilities. Segments Residential (Shingles) vs Commercial (PVC/Membrane) vs Specialized (Gutters/Ice). Uses specific technical language (e.g., ""California Cut Valleys,"" ""No Layovers"") to demonstrate expertise and differentiate from cheap competitors.	- Residential Card (Owens Corning Duration + No Layovers policy); - Commercial Card (GAF PVC/TPO + NDL Warranty); - Gutter & Fascia Card; - Ice Management Card (Heat Cables); - ""Get Certified Quote"" CTA buttons.	To Do	- As a homeowner, I want to know if you do asphalt shingles and what brand you use; - As a business owner, I want to see if you handle flat roofs; - As a user, I want to quickly request a quote for a specific service.	- All 4 major service categories displayed; - ""Get Quote"" links to the Quote Tool; - Content explicitly states ""No Layovers"" and ""California Cut"" per RHIVE DATA.	Pending	- Dependency: Service Icons (Lucide); - Dependency: Quote Tool link.
Our Process	PUBLIC	P-03	THE 10-STAGE AUTOMATED JOURNEY	Critical	Visualizes the 10-Stage workflow to reassure customers they won't be ""ghosted."" Displays the vertical timeline from ""Lead"" to ""Completion,"" emphasizing the automated updates and transparency at every step.	- Vertical Timeline Component; - 10 Distinct Stages (Lead, Estimate, Quote, Sign, Schedule, Pre-Install, Install, Punch List, Invoice, Completion); - Hover effects showing stage details; - ""Start Your Journey"" CTA.	To Do	- As a customer, I want to know what happens after I sign the contract; - As a user, I want to see the timeline of a typical project so I can plan my life.	- All 10 stages match RHIVE DATA exact naming; - Mobile responsive vertical layout; - Animations on scroll.	Pending	- Dependency: Workflow Diagram Data.
Financing	PUBLIC	P-04	RPSP & PAYMENT OPTIONS	High	Explains the ""Project Savings Promotion"" (RPSP) to drive immediate conversions. Details the payment schedule (50/40/10) and financing partnerships. Critical for setting expectations about money before the sales call.	- RPSP Explanation Card (10% Savings / 48hr Residential / 7-Day Commercial); - Payment Terms Visual (50% Deposit, 40% Install, 10% Final); - ""Right to Rescission"" Assurance; - Financing ""Prequalify"" button.	To Do	- As a customer, I want to know how to save 10% on my roof; - As a user, I want to see if I can finance the project; - As a client, I need to know when my payments are due.	- RPSP logic (48hr/7day) is clearly stated; - Payment schedule matches RHIVE DATA (50/40/10); - ""Right to Rescission"" explicitly mentioned to lower anxiety.	Pending	- Dependency: Financing Partner Link.
Contact	PUBLIC	P-05	DIRECTORY & LEAD GEN	High	The primary conversion point for non-quote inquiries. Unlike generic contact pages, this lists specific Founder/Leadership direct lines to prove accessibility and transparency.	- Office Address (525 Aspen Meadow Dr); - Founders' Direct Lines (Kara/Michael); - ""Message Us"" Form (Zoho Integration); - Social Media Links; - Interactive Google Map.	To Do	- As a user, I want to call Michael or Kara directly if I have a major issue; - As a customer, I want to find your office location; - As a lead, I want to ask a question without getting a full quote.	- Contact info matches RHIVE DATA; - Form submission triggers email/CRM; - Map loads correctly.	Pending	- Dependency: Google Maps API; - Dependency: Zoho Forms Integration.
Login Page	PUBLIC	P-06	User authentication and access	High	Single login portal for all user types. Redirects to the appropriate dashboard post-login.	- Phone number (SMS) authentication; - Biometric login option; - 2FA (Authenticator App); - 'Remember Me' checkbox; - 'Contact Support' link; - Live Chat link; - Terms of Service link; - Privacy Policy link	To Do	- As a user, I want to log in securely from one place; - As a user, I want to use SMS authentication for a simple login; - As a user, I want the option to use biometrics for faster login; - As a user, I want the option to use an authenticator app; - As a user, I want a "Remember Me" option for convenience; - As a user, I want access to help if I have login issues; - As a user, I want to see legal information.	- User can enter a phone number and receive an SMS code; - Correct SMS code logs the user in; - Biometric prompt appears and logs in on successful scan; - User can set up and log in with a 2FA authenticator app; - "Remember Me" keeps the user logged in for 30 days; - Support and Legal links open the correct pages/widgets.	Pending	- Biometrics and 2FA app require initial setup post-login; - All features are part of the L-01 page build.
Password Reset	PUBLIC	P-07	Secure Account Recovery	High	A dedicated, secure page allowing users to regain access via SMS (Default) or Email. Designed to prevent account enumeration attacks while offering speed for employees in the field.	- Toggle Switch: "Reset via Phone" (Default) vs. "Reset via Email"; - Input Field: Dynamic based on toggle; - Security: Google reCAPTCHA v3 (Invisible); - Action: "Send Recovery Code" button; - No Support Link: Clean interface to prevent social engineering.	To Do	- As a field employee, I want to reset my password via text because I don't check email on the roof, so I can get back to work fast; - As a secure user, I want to be auto-logged in after resetting so I don't have to type the new password twice.	- Default State: Page loads requesting Phone Number; - "Ghost" Logic: Always displays "If an account exists, a code has been sent" (Never reveals if user is missing); - Auto-Login: Upon successful password change, system creates session and redirects to Dashboard immediately; - Validation: Blocks invalid phone formats.	Pending	- API: Twilio (SMS) & SendGrid/SMTP (Email); - Security: Token must expire in 15 minutes; - UI: No "Help" chat to prevent distraction/phishing.
PUBLIC ESTIMATE TOOL	PUBLIC	P-08	Lead Generation & Ballpark Pricing	High	Self-service estimation tool. Allows anonymous ballpark pricing (transparency-first), then upsells "Tire Kickers" to "Leads" by offering a "Certified Quote" (valid for 2 weeks) which requires Portal account creation.	- Google Maps Address Verification; - 4-Step Roof Configurator (Material, Pitch, Layers); - Gutter & Heat Trace add-ons; - Ungated "Ballpark" Price Display (No email required); - CTA: "Request Certified Quote"; - Auto-Portal Account Creation.	To Do	- As a homeowner, I want to check pricing anonymously so I don't feel pressured; - As a serious buyer, I want to lock in this price for 2 weeks by requesting a certified quote; - As RHIVE, I want to filter out low-intent users and only capture high-intent leads in the portal.	- Address input loads satellite map; - Changing "Gutter" toggle updates price instantly; - Price is visible *before* email input; - Clicking "Request Certified Quote" forces account creation/login; - User is redirected to Client Portal (C-01) with the estimate in their "Shopping Cart".	Pending	- Dependency: Pricing Engine (E-05); - Dependency: Customer Portal (C-01); - Logic: "Certified" price valid for 14 days.
CONTRACTOR SIGNUP	PUBLIC	P-09	Vendor Onboarding & Vetting	Medium	Public application. STARTS with mandatory Dual Authentication (Phone & Email) to prevent spam. Then unlocks form to collect legal docs and history. Profiles are held in "Pending" for rigorous Admin review (Docs, Online Reviews, History). Access to Pricing/Bidding is blocked until manual approval.	- Step 1: Dual Auth Gate (SMS Code + Email Link); - Step 2: Doc Upload (License, Ins, W9, WC); - Step 3: Company History & Review Check; - Status Screen: "Pending Approval - Vetting in Progress"; - Admin Notification.	To Do	- As a legitimate contractor, I want to securely verify my identity first so I can submit my confidential docs; - As RHIVE, I want to vet contractors against online reviews and background checks before they can ever bid.	- Phone & Email must be verified BEFORE form loads; - Submission locks profile into "Pending"; - Messaging informs user that "Online Reviews & Docs" are being checked; - Pricing input pages remain hidden/locked until Admin grants "Active" status.	Pending	- Security: Prevent spam by gating the form; - Logic: "Pending" users have read-only access to their own profile, no access to jobs.
PUBLIC CAREERS	PUBLIC	P-10	Recruitment & Brand Manifesto	Medium	The Revolution. This page sells the vision of how RHIVE is changing the service industry from all fronts. It focuses on the "Why" and "How," highlighting culture, innovation, and benefits to attract top-tier talent.	- "The Mission" Video/Hero Section; - "Industry Revolution" Content Block; - Interactive Benefits Grid; - Employee Testimonials; - Filterable Job Board (Dept/Location); - CTA: "Join the Hive".	To Do	- As top talent, I want to see how RHIVE is innovating the industry so I feel inspired to leave my current job; - As a seeker, I want to filter jobs to find my fit.	- Content clearly explains the "Industry Change" mission; - Job list pulls dynamically from HR database; - "Apply" button links directly to the specific job on P-04.	Pending	- Assets: Needs high-quality media/copy regarding the "Service Industry Revolution."
JOB APPLICATION	PUBLIC	P-11	Candidate Intake Wizard	Medium	An interactive, step-by-step intake form (Typeform style). It captures structured data rather than just a PDF, ensuring candidates prove they are tech-savvy enough to work here.	- Interactive "Wizard" Form (One question per slide); - Resume Uploader; - Video Cover Letter Option; - Screening Questions (Experience, Salary); - Auto-Email "Application Received".	To Do	- As a candidate, I want a modern, smooth application process that reflects the company's tech focus; - As Maureen (HR), I want structured data (not just messy PDFs) sent to my queue immediately.	- Form completion triggers email notification to HR (Maureen); - Data creates a "Candidate Profile" in the HR module (E-15); - Interactive validation prevents incomplete submissions.	Pending	- Routing: Notifications routed to Maureen's user ID; - Storage: Resumes stored in secure candidate bucket.
ESTIMATE TOOL	PUBLIC	P-12	Lead Generation & Ballpark Pricing	High	HTML INSTANT ESTIMATE. Self-service estimation tool. Allows anonymous ballpark pricing (transparency-first), then upsells "Tire Kickers" to "Leads" by offering a "Certified Quote" (valid for 2 weeks) which requires Portal account creation.	- Google Maps Address Verification; - 4-Step Roof Configurator (Material, Pitch, Layers); - Gutter & Heat Trace add-ons; - Ungated "Ballpark" Price Display (No email required); - CTA: "Request Certified Quote"; - Auto-Portal Account Creation.	To Do	- As a homeowner, I want to check pricing anonymously so I don't feel pressured; - As a serious buyer, I want to lock in this price for 2 weeks by requesting a certified quote; - As RHIVE, I want to filter out low-intent users and only capture high-intent leads in the portal.	- Address input loads satellite map; - Changing "Gutter" toggle updates price instantly; - Price is visible *before* email input; - Clicking "Request Certified Quote" forces account creation/login; - User is redirected to Client Portal (C-01) with the estimate in their "Shopping Cart".	Pending	- Dependency: Pricing Engine (E-05); - Dependency: Customer Portal (C-01); - Logic: "Certified" price valid for 14 days.




RHIVE Quantum Operating System (QOS): The Antigravity Deployment Protocol
1. Executive Protocol and Architectural Vision
1.1 The Paradigm Shift: Architecting with Antigravity
The construction of the RHIVE Quantum Operating System (QOS) represents a fundamental departure from traditional software development methodologies. We are moving beyond the era of manual coding into the age of agentic orchestration. The objective is not merely to write code but to direct a workforce of autonomous digital entities—Google Antigravity Agents—to erect a digital skyscraper that defines the future of the construction industry. This document serves as the master flight plan for this operation, designed specifically to empower a human "Mission Commander"—regardless of deep coding expertise—to direct a squad of AI agents to build a system of "Ineffable" quality.1
The deployment of the QOS is predicated on the "Agent-First" architecture facilitated by Google Antigravity. Unlike standard coding assistants that offer autocomplete suggestions within a single file, Antigravity provides a "Mission Control" interface—the Agent Manager—where developers spawn, monitor, and interact with multiple agents operating asynchronously across different workspaces.1 This capability allows us to execute a "Six Worlds" topology, creating distinct but interconnected user experiences for the Public, Admins, Employees, Customers, Contractors, and Suppliers, all sharing a unified data nucleus.4
1.2 The "Ineffable" Standard: A Qualitative Law
Before a single agent is spawned, the "Ineffable" standard must be codified as the prime directive for all AI operations. This is not a functional requirement but a qualitative law that dictates the user experience. The system must feel magical, utilizing "Optimistic UI" updates to ensure zero perceived latency; when a user interacts with the system, the interface must respond instantly, handling server confirmation in the background.4 furthermore, the architecture must support "Contextual Intelligence," delivering critical information based on geographic location rather than static navigation menus, and "Frictionless Authentication" via the "Ghost Link" protocol to remove password barriers for field staff.4
This report details the exact tasks, sequence, and agent instructions required to realize this vision. It translates the high-level "Tech-Noir" aesthetic—characterized by dark themes, neon RHIVE Pink accents, and circuitry animations—into granular technical specifications.4 By adhering to this protocol, the Mission Commander will orchestrate the creation of a multi-tenant operating system capable of automating the chaos of construction with military precision and futuristic elegance.

2. Mission Control Setup: The Antigravity Environment
2.1 The Agent Manager Interface
The journey begins not in a text editor, but in the Agent Manager. This interface acts as the Mission Control dashboard, designed for high-level orchestration. It allows the Mission Commander to act as an architect, defining high-level objectives while the agents handle the implementation details, generating artifacts such as task lists, implementation plans, and code diffs for review.1
Concept for the Mission Commander:
Think of the Agent Manager as a construction site office. You do not pick up a hammer or pour concrete. Instead, you hand detailed blueprints (Prompts) to your Foremen (Agents) and review their work plans (Artifacts) and progress reports (Walkthroughs) before giving the approval to proceed. This separation of concerns allows you to manage complexity without getting lost in syntax.3
To begin, you must install Google Antigravity locally on your machine. It requires a Chrome web browser and a personal Gmail account for the preview access.1 Once installed, launching the application presents the Agent Manager. From here, you will initialize the project repository.
2.2 Global Stack Configuration
Objective: Establish the technological foundation that supports high performance, real-time data synchronization, and the specific aesthetic requirements of the RHIVE brand.
Agent Deployment:
In the Agent Manager, click "New Task" to spawn your first agent. We will designate this agent "Infrastructure-Alpha." Its sole responsibility is to lay the groundwork.
Prompt Payload for Infrastructure-Alpha:
"Initialize a new project repository for the RHIVE Quantum Operating System (QOS). We are building a high-performance, real-time operating system for the construction industry.
Technical Stack Requirements:
Framework: Initialize a Next.js 14 application using the App Router to ensure high-performance server-side rendering and SEO capabilities.4
Language: Enforce TypeScript for all files to ensure strict type safety and error prevention across the complex business logic we will build.
Styling Engine: Install and configure Tailwind CSS. You must customize the tailwind.config.js file to include the specific RHIVE color palette defined in the design system.
Database: Initialize the connection to Google Firebase, specifically Cloud Firestore, to handle real-time NoSQL data syncing.
Authentication: Set up Firebase Authentication to support both standard email/password logins and the custom 'Ghost Link' token system we will build later.
State Management: Install Zustand. We will use this for handling complex client-side states, such as the multi-variable pricing engine, without inducing render lag.4
Icons: Install the Lucide-React library. These icons align with the clean, tech-noir aesthetic we require.
Brand Configuration (Critical):
In the Tailwind config, extend the theme to include these precise colors from the RHIVE Brand Guide 5:
Primary Accent (Pink): #ec028b
Background (Black): #000000
Surface Primary (Dark Gray): #111827 (gray-900)
Surface Secondary (Medium Gray): #1f2937 (gray-800)
Secondary Blue: #08137C
Secondary Gold: #e2ab49
Deliverable:
Do not write code yet. First, generate an implementation_plan.md artifact outlining the proposed directory structure to support our 'Six Worlds' topology. Also, generate a task_list.md detailing the setup steps."
Artifact Review Protocol:
Once Infrastructure-Alpha submits the implementation_plan.md, you must review it against the "Six Worlds" requirement. The directory structure is the skeleton of the entire system.
Check: Does the plan propose a flat structure? If so, Reject it.
Requirement: The structure must use Next.js Route Groups to distinctly separate the logic for the different user types. It should look like this:
src/app/(public): For L-01, E-04 (Lead Gen).
src/app/(admin): For A-01, E-05 (Pricing Engine).
src/app/(employee): For E-02, E-12 (Workflow).
src/app/(customer): For C-01 (Portal).
src/app/(contractor): For CO-05 (PWA).
src/app/(supplier): For S-01 (Inventory).
Only when the directory structure reflects this topology should you click "Approve" to let the agent execute the code generation.

3. Phase 1: The Data Layer (World 0)
3.1 Strategic Data Architecture
Strategic Insight: In a system driven by complex workflows and financial calculations, the data structure determines destiny. If the schema is flawed, the user interface will be sluggish and difficult to maintain. We must build the database first, ensuring it supports the specific "Dual-Math" pricing (Internal vs. Retail costs) and the "Rotting" logic for project management visualization.4
We will utilize Cloud Firestore because its real-time listeners are the only efficient way to power the "Live Feed" features required later, where a photo taken by a crew member on a roof must appear instantly on a homeowner's screen without a page refresh.4
3.2 Firestore Schema Definition
Agent Deployment:
Spawn a new agent named "Data-Architect-Beta." This agent will be responsible for defining the data models.
Prompt Payload for Data-Architect-Beta:
"Design the Firestore Schema for the QOS. Based on the Master Blueprint, we need the following top-level collections. Create a schema.ts file that defines TypeScript interfaces for all these models.
1. users Collection:
Stores authentication profiles.
Fields: uid, email, phone, role (Array: ['Admin', 'Employee', 'Customer']), ghost_token (for contractors), biometric_id (for fast login).
2. projects Collection (The Core Unit):
This is the central node for all workflows.
Critical Logic: Include a stage_last_updated timestamp. This is required to support the 'Rotting' visualization logic on the Kanban board (cards turning gray/moldy if inactive for too long).4
Financials Object: The schema must support a nested financials object that explicitly separates internal_cost (Materials + Labor) from retail_price (Price sold to customer). This separation is vital for the 'Dual-Math' pricing engine.
Sub-collections: Each project document must have sub-collections for quotes, invoices, and photos.
3. leads Collection:
Stores transient data from the public estimate tool before it becomes a full project.
Fields: address, solar_data (pitch, azimuth, area from Solar API), contact_info.
4. catalog Collection (Line Item Database):
Stores the master list of materials and labor tasks.
Universal Translator: Each item needs fields for internal_cost, retail_price, supplier_sku, and rhive_id. This mapping allows us to translate our internal codes to supplier-specific codes automatically.4
Sales Script: Include a field the_why_script to store the high-energy value proposition text for that item.5
5. audit_logs Collection:
An immutable record of all user actions for liability protection.
Deliverable: The TypeScript interface definitions and a script to initialize these collections with dummy data for testing."
3.3 Security Rules & The Ghost Link Protocol
Concept for the Mission Commander: The "Ghost Link" is a critical security innovation for this system. Traditional login/password flows have high failure rates with transient field labor. A Ghost Link is a cryptographically secure, high-entropy URL token that acts like a digital key. We need to instruct the agent to build a "Bouncer" that recognizes these keys.4
Agent Deployment:
Continue with "Data-Architect-Beta" or spawn a new "Security-Sentinel" agent.
Prompt Payload for Security-Sentinel:
"Write the firestore.rules configuration file to enforce our security model.
Role-Based Access Control (RBAC):
Admins: Allow read, write on all collections.
Employees: Allow read, write on projects where they are assigned. Allow read only on catalog.
Customers: Allow read only on projects documents where resource.data.customer_id == request.auth.uid.
The Ghost Link Protocol (Critical):
We need a custom function for unauthenticated access via Ghost Links.
Allow read, write access to the job_pwa sub-collection of a specific project IF the request contains a custom header X-Ghost-Token that matches the ghost_token field stored in the project_contractors map.
This rule allows field crews to upload photos and view job details without a user account, but restricts them strictly to the specific job they are assigned to.
Deliverable: The firestore.rules file and a set of unit tests simulating access attempts from different roles."
Verification:
Review the firestore.rules artifact. Ensure the "Ghost Link" logic is present. It ensures that if a contractor is fired, we can simply regenerate the token in the database, and their old link immediately stops working. This is "Revocability," a key security requirement.4

4. Phase 2: World 1 - PUBLIC (The Front Door & Lead Gen)
4.1 L-01: Universal Login & The Tech-Noir Aesthetic
Strategic Insight: The Public World is the face of the brand. It must communicate the "Futuristic AI" aesthetic immediately. We are not just building a login form; we are building an immersive entry point. The design must feature the "Circuitry" animation—dark, immersive, with neon RHIVE Pink (#ec028b) accents pulsing to guide the user's eye.4
Agent Deployment:
Spawn "Frontend-Delta." This agent focuses on UI/UX engineering.
Prompt Payload for Frontend-Delta:
"Build the Universal Login Page (Page ID: L-01).
Visual Requirements (Tech-Noir):
Background Component: Create a reusable component named CircuitryBackground.tsx. It must render an HTML5 Canvas animation of a dark circuit board network.
Animation: Dots and lines should pulse and connect like a neural network.
Color: Use the RHIVE Pink #ec028b for the active pulses against a pure Black #000000 background.
Login Card: Center a 'Glass-morphic' card (frosted glass effect using backdrop-blur in Tailwind) over the background.
Logo: Display the White version of the RHIVE logo 5 at the top of the card for maximum contrast.
Functional Requirements:
Input: A single, clean input field for 'Mobile Number'.
Identity Logic: On form submission, query the users collection.
If User Exists: Trigger the Firebase Phone Auth flow to send a 6-digit SMS code.
If User Missing: Redirect to the Account Recovery page (L-02). Security Note: Display a generic message ('If an account exists, a code has been sent') to prevent user enumeration attacks.4
Biometric Trigger: Check if the device supports WebAuthn. If so, prompt for FaceID/TouchID immediately after the phone number is entered to reduce friction.
Deliverable: The React components and the routing logic."
Artifact Review Protocol:
When the agent submits the Screenshots or Walkthrough artifact, look closely at the background. It should not be a static image. It must be moving. The "Glass" effect on the card should blur the moving lines behind it. This depth is essential for the "Ineffable" quality.
4.2 E-04: Public Estimate Tool (The Solar API Integration)
Concept for the Mission Commander: This is the primary lead generation engine. It allows a homeowner to get a "Ballpark" price anonymously. To do this without sending a human to the house, we must integrate the Google Solar API. This API provides detailed rooftop data—pitch, azimuth, and area—from satellite imagery.6
Agent Deployment:
Spawn "Integration-Gamma." This agent specializes in API connectivity.
Prompt Payload for Integration-Gamma:
"Build the Public Estimate Tool (Page ID: E-04).
Step 1: Map Interface:
Implement the Google Maps JavaScript API to display a satellite view centered on the user's input address.
Overlay a UI panel ('The Configurator') that allows the user to confirm the roof perimeter.
Step 2: Solar API Integration:
Connect to the Google Solar API buildingInsights endpoint.
Pass the latitude/longitude of the address.
Extract the solarPotential.roofSegmentStats object from the response. This gives us the pitchDegrees, azimuthDegrees, and areaMeters2.
Step 3: The Math Engine:
Create a utility function calculateEstimate(solarData, materialType).
Total Squares: Convert areaMeters2 to square feet and divide by 100.
Waste Factor: Apply a dynamic multiplier based on the pitch. If pitchDegrees > 30 (Steep), apply a 15% waste factor. If < 30 (Walkable), apply 10%.
Base Rate: Multiply the result by a configurable BaseRate (e.g., $450/sq for shingle, $800/sq for metal).
Step 4: The Upsell (Lead Capture):
Display the calculated price in a large, animated ticker that counts up to the final number.
Place a 'Lock this Price' button below the ticker.
Logic: The price is visible before we ask for contact info. This 'Give before you Get' mechanic builds trust.
Clicking the button opens a modal to capture Name/Phone. On submit, save this data to the leads collection and trigger the 'Lead' stage workflow.
Deliverable: The component code and an API route to proxy the Solar API requests (to hide our API key)."
Verification:
Instruct the agent to run a Walkthrough. The video artifact should show the agent typing an address, the map loading (under 2 seconds), the Solar API returning data, and the price ticker animating. If the load time is slow, instruct the agent to implement "SWR" (Stale-While-Revalidate) caching for the API responses.

5. Phase 3: World 2 - ADMIN (The Brain & Pricing Engine)
5.1 A-01: Admin Dashboard & The Pulse
Strategic Insight: The Admin World requires "Data Density." The visual theme shifts to darker backgrounds with high-contrast data visualization (Neon Green for profit, Red for alerts). The centerpiece is "The Pulse"—a live profit ticker that updates in real-time.4
Agent Deployment:
Spawn "Dashboard-Epsilon."
Prompt Payload for Dashboard-Epsilon:
"Build the Admin Dashboard (Page ID: A-01).
Visuals: Use a modular grid layout with a dark background (bg-gray-900).
Widget 1: The Pulse Ticker (Real-Time Profit):
Create a widget that calculates 'Net Profit MTD' live.
Formula: (Sum(All_Invoiced_Projects) - Sum(All_COGS)) - (Fixed_Overhead_Daily * Day_Of_Month).
Tech: Use a Firestore real-time listener. When a material Purchase Order is created anywhere in the system, this number must update instantly on the screen without a refresh.
Widget 2: Red Flag Logic:
Create a 'Problem Widget' that queries for exceptions.
Stalled Jobs: Query projects where stage_status == 'Install' AND stage_last_updated < (Current Date - 7 days).
Margin Erosion: Query projects where actual_cost > quoted_cost.
Compliance: Query contractors where insurance_expiry < (Current Date + 7 days).
Interaction: Clicking a flag (e.g., '3 Stalled Jobs') must redirect the user to the Project Hub (E-12) with a pre-applied filter showing only those jobs.
Deliverable: The dashboard layout and the Red Flag query logic."
5.2 E-05: The Dual-Math Pricing Engine
Strategic Insight: Most quoting tools fail because they only calculate one price. RHIVE requires "Dual-Math" architecture: calculating the Internal Cost (Floor) and the Retail Price (Ceiling) simultaneously to manage margin.4
Agent Deployment:
Spawn "Logic-Zeta." This agent focuses on pure business logic.
Prompt Payload for Logic-Zeta:
"Develop the Pricing Engine logic (Page ID: E-05). Create a TypeScript class PricingCalculator that will be used across the admin and employee worlds.
Inputs: RoofArea, Pitch, MaterialSelection (SKU), ZipCode.
Calculation 1: Internal Cost (The Floor):
Query the catalog for the specific material SKU cost.
Query the contractor_rates collection for the labor rate in the specific ZipCode.
Sum these values to get BaseCost.
Calculation 2: Retail Price (The Customer Price):
Fetch Overhead_Per_Square from the global settings (this is derived from annual rent/salaries divided by capacity).
Apply the Target_Margin (e.g., 30%).
Formula: (BaseCost + Overhead_Per_Square) / (1 - Target_Margin).
State Management:
Connect this class to a Zustand store.
Requirement: When a user moves a slider for 'Pitch' in the UI, it must instantly recalculate both Internal and Retail numbers across the entire application state.
Deliverable: The PricingCalculator class and a unit test validating the margin formula."
5.3 E-07: The Universal Translator
Concept for the Mission Commander: Suppliers and Contractors use different names for the same thing. We call it "Shingle Install," they call it "Square App." To prevent ordering errors, we need a translation layer.4
Agent Prompt (Addendum to Logic-Zeta):
"Enhance the Catalog system with a 'Universal Translator' map.
In the catalog item schema, add a map field aliases.
Structure: { 'Supplier_ABC': 'OC_Dur_Onyx_Bundle', 'Contractor_XYZ': 'Sq_Install_Arch' }.
Logic: When generating a Purchase Order for Supplier ABC, the system must swap the internal RHIVE_ID for the Supplier_ABC SKU automatically."

6. Phase 4: World 3 - EMPLOYEE (The Workflow & Automation)
6.1 The 10-Stage Workflow & Gamification
Strategic Insight: The Employee World manages the 10-stage customer journey (Lead -> Estimate -> Quote -> Sign -> Schedule -> Pre-Install -> Install -> Punch-list -> Invoicing -> Completed). It must use gamification ("Income Actionator") to keep sales reps motivated and strict logic gates to prevent errors.4
Agent Deployment:
Spawn "Frontend-Delta" for the UI components.
Prompt Payload for Frontend-Delta:
"Build the Employee Dashboard (Page ID: E-02).
Widget 1: The Income Actionator:
Create a 'Slot Machine' style ticker widget.
Data Source: Listen to the commissions sub-collection for the logged-in user.
Animation Logic: When a deal status changes to 'Sold' in the database, trigger a spinning animation on the ticker that lands on the new total commission amount. Use a subtle sound effect.
Widget 2: Task Attack List:
Query the tasks collection.
Sorting Logic: Do not sort by date. Sort by project_value.
Philosophy: The highest dollar-impact tasks must appear at the top to prioritize revenue-generating activities.4
Deliverable: The dashboard components."
6.2 E-20: The RPSP (Project Savings Promotion) Engine
Strategic Insight: The "Project Savings Promotion" (RPSP) is a core revenue driver. It offers a discount (e.g., 10%) if a customer commits within a short window (48 hours). This requires a server-side timer that persists across sessions.4
Agent Deployment:
Spawn "Logic-Zeta."
Prompt Payload for Logic-Zeta:
"Implement the Project Savings Promotion (RPSP) logic for the Quote Page (E-20).
1. The Timer State:
When a quote is generated, write a quote_created_at timestamp to the project document.
Define a constant RPSP_WINDOW = 48 hours.
2. The Countdown Logic:
Create a React hook useRPSP(projectID).
Calculate time_remaining = (quote_created_at + RPSP_WINDOW) - current_server_time.
Important: Use server time (Firestore timestamp), not the user's device time, to prevent tampering.
3. Dynamic Pricing Rendering:
If time_remaining > 0: Render the quote with a specific line item: 'Project Savings Promotion: -$1,000'. Display a countdown clock in the header.
If time_remaining <= 0: Programmatically remove the discount line item. Update the Total Price. The 'Kiosk Mode' view must update in real-time if the customer is viewing it when the timer hits zero.
4. The Rescission Gate (E-21):
Add a mandatory checkbox on the signing page: 'I waive my 3-day right of rescission to start immediately.'
Logic: If checked, set project_status to 'Schedule' immediately. If unchecked, set status to 'Pending_Rescission' and block any material ordering for 72 hours.4
Deliverable: The RPSP hook and the modified Quote component."
6.3 E-23: Symbiote AI & Tone Optimizer
Strategic Insight: The "Symbiote" is the AI assistant overlay. A key requirement is the "Tone Optimizer." Based on the "High-Energy" communication guidelines, employees are forbidden from using "weak" language like "just," "hopefully," or "checking in".4 We will use an LLM to enforce this.
Agent Deployment:
Spawn "AI-Specialist-Theta."
Prompt Payload for AI-Specialist-Theta:
"Build the 'Tone Optimizer' middleware using the OpenAI API.8
Integration: Connect to the text input fields in the 'Symbiote' chat overlay (E-23).
The Tone Guard System Prompt:
'You are a high-energy communication coach for RHIVE Construction. Your goal is to rewrite user input to be direct, assertive, and positive.
Prohibited Words: just, basically, hopefully, checking in, sorry to bother, I guess, maybe.
Style: Assertive, high-energy, helpful, unequivocal.
Example Input: "I was just checking if the permit is ready."
Example Output: "Update: I am monitoring your permit status and will notify you the moment it clears."
Example Input: "Sorry to bother you, but can you send the check?"
Example Output: "Please remit the final payment to clear the balance."
UI Interaction:
When the user types a message, scan for prohibited words locally (regex).
If detected, Disable the 'Send' button.
Send the text to the LLM to generate the rewrite.
Display the rewrite and a button 'Accept & Send'. The user cannot send the weak version.
Deliverable: The middleware function and the UI component for the chat input."

7. Phase 5: World 5 - CONTRACTOR (The Offline PWA)
7.1 PWA Configuration & Offline Persistence
Strategic Insight: This is the most technically demanding phase. Roofing crews operate in dead zones with poor cellular coverage. If the app stops working when they lose signal, the system fails. We must architect the Contractor Portal (CO-05) as a Progressive Web App (PWA) with robust offline capabilities.4
Agent Deployment:
Spawn "Mobile-Architect-Sigma." This agent specializes in mobile web technologies.
Prompt Payload for Mobile-Architect-Sigma:
"Configure the Next.js application as a Progressive Web App (PWA) specifically for the Contractor World (Page ID: CO-05).
1. Manifest Configuration:
Create a manifest.json file. Set display: standalone to ensure the app opens full-screen without browser bars, feeling like a native app.
2. Service Worker Strategy:
Implement next-pwa or a custom Service Worker.
Caching Strategy: Use 'Stale-While-Revalidate' for the 'My Jobs' page. This ensures the crew sees the last known job list immediately upon opening the app, even without a signal.
3. Firestore Offline Persistence (Critical):
In the Firebase initialization file firebase.ts, call the method enableMultiTabIndexedDbPersistence(firestore).9
Logic: This function enables the app to query the projects collection against a local IndexedDB cache when the network is unreachable.
4. Background Sync Pattern:
Field crews need to upload photos offline.
Implement a 'Queue' pattern using Redux Offline or a custom IndexedDB queue.
Workflow:
User takes photo -> Save image blob to local IndexedDB.
Create a 'Pending Upload' task in the local queue.
Register a Service Worker sync event (or use a window.ononline listener) to detect when connectivity is restored.
Sync Event: Iterate through the queue, upload each image to Firebase Storage, get the download URL, and update the Firestore document.
Deliverable: The PWA configuration files and the 'Photo Upload Queue' logic."
Architect's Note: This specific prompt is critical. Standard web apps will fail in the field. You must insist on the "IndexedDB" and "Background Sync" patterns. Review the artifacts to ensure enableMultiTabIndexedDbPersistence is correctly implemented with error handling for browser compatibility.10
7.2 The Live Feed (E-24 Sync)
Concept for the Mission Commander: When a crew member takes a photo of a "Tear-Off" on the roof, that image must appear on the Customer's "Pizza Tracker" page instantly. This builds immense trust.
Agent Prompt (Addendum to Mobile-Architect-Sigma):
"Build the 'Live Feed' feature (E-24).
Contractor Side:
When a photo is tagged as 'Installation_Progress' and uploaded, trigger a Cloud Function onFileUpload.
Cloud Function:
Resize the image to a thumbnail for performance.
Write a new document to the customer_portal_feed sub-collection for that specific project.
Customer Side (C-01):
Implement a Firestore onSnapshot listener on the customer_portal_feed collection.
Effect: As soon as the Cloud Function writes the document, the image should appear on the customer's screen immediately without a page refresh.
Deliverable: The Cloud Function and the Customer Feed component."

8. Phase 6: World 4 & 6 - CUSTOMER & SUPPLIER
8.1 C-03: The Abundance Network (Affiliate Hub)
Strategic Insight: We want to turn past customers into an active sales force. The "Abundance Network" is the affiliate program. We need a gamified interface for tracking referrals.4
Agent Deployment:
Spawn "Frontend-Delta."
Prompt Payload for Frontend-Delta:
"Build the Abundance Network Hub (Page ID: C-03).
Referral Logic:
On user creation, generate a unique 6-character referral_code for the customer.
Create a 'Share' button that copies a link: rhive.com/est?ref=CODE.
Tracking System:
Create a referrals collection.
Trigger: When a new Lead is created with a ref parameter, create a referral document linked to the referrer with status 'Pending'.
Payable Trigger: When the Lead project status moves to 'Install', automatically update the referral status to 'Payable'.
UI Gamification:
Create a dashboard showing 'Total Bounty Earned'.
Use the RHIVE Pink glow effect for the earnings counter to make it visually rewarding.
Deliverable: The referral tracking logic and the UI dashboard."
8.2 S-01: Supplier Dashboard & Share of Wallet
Strategic Insight: Suppliers are motivated by volume. We will use a "Share of Wallet" widget to show them exactly how much of RHIVE's business they are winning versus their competitors. This psychological trigger drives them to offer better pricing.4
Agent Deployment:
Spawn "Backend-Omega."
Prompt Payload for Backend-Omega:
"Build the Supplier Dashboard (Page ID: S-01).
Analytics Widget: Share of Wallet.
Query the purchase_orders collection for the last 30 days.
Group the orders by supplier_id.
Calculate the percentage of total spend allocated to the logged-in supplier.
Visual Display: Render a gauge chart.
Psychological Logic: If the share is < 50%, color the gauge Red to motivate the supplier. If > 50%, color it Green.
Deliverable: The aggregation query and the Gauge component."

9. Deployment Order & Execution Protocol
Order of Operations for the Mission Commander:
You must execute the build in this specific sequence to handle dependencies. You cannot build the "Quote Page" (Phase 3) before the "Pricing Engine" (Phase 2), and you cannot build the "Pricing Engine" before the "Database Schema" (Phase 1).
Sequence
Phase
Critical Component
Rationale
1
Infrastructure
Stack, Firestore, Auth
The foundation. Nothing runs without Next.js and Firebase.
2
Data Layer
Schema, Security Rules
Defines the data structure. "Dual-Math" fields must exist here.
3
Admin World
Pricing Engine, Catalog
We need products and pricing logic before we can sell anything.
4
Public World
Login, Estimate Tool
Now we have a way to generate Leads (E-04) and capture users.
5
Employee World
Workflow, Dashboard
Now we can process the leads through the 10-stage pipeline.
6
Contractor World
Offline PWA
Now we can build the roofs. Requires the Project data from step 5.
7
Customer World
Live Feed, Payments
Now we can get paid. Requires the Install data from step 6.
8
Intelligence
Symbiote, RPSP, Tone
Optimization. Adds the "Ineffable" quality to the functional system.

9.1 Verification Strategy: The "Artifact" Review
For every task, the Google Antigravity Agents will generate Artifacts (Task Lists, Implementation Plans, Walkthroughs).1 Do not blindly approve code. You must act as the Quality Assurance gatekeeper.
Checklist for Review:
Task List: Does it match the prompt? Did they include the specific "Offline" requirement for the PWA?
Implementation Plan: Check the directory structure. Are the "Six Worlds" separated?
Walkthrough (Critical): This is the proof of work.
If the agent claims to have built the "Solar API Integration," check the video artifact. Does it show real roof data appearing on the map?
If the agent claims to have built the "Tone Optimizer," check the screenshot. Does it show the "Accept & Send" button when weak language is typed?
Aesthetic Check: If an artifact shows a plain white interface, use the feedback box: "The design is too flat. Apply the CircuitryBackground component and increase the neon glow intensity to match the Tech-Noir requirements."

10. Conclusion: The "Ineffable" Outcome
By following this Antigravity Deployment Protocol, you are not merely building a CRM; you are orchestrating the creation of the RHIVE Quantum Operating System. This process leverages the full power of agentic development to produce a system that is:
Visually Immersive: A "Tech-Noir" command center that feels like the future.
Operationally Frictionless: "Ghost Link" access and "Optimistic UI" updates remove all barriers to speed.
Financially Intelligent: A "Dual-Math" engine that protects margins in real-time.
Field Resilient: An offline-first PWA that empowers crews anywhere.
Mission Commander: Open Google Antigravity. Initialize the Agent Manager. Begin with Phase 1. The blueprint is ready for liftoff.

Appendix: Technical Reference for Agents
Primary Color: #ec028b (RHIVE Pink) 5
Font (UI): Rubik 5
Font (Report): EB Garamond 5
Solar API Endpoint: https://solar.googleapis.com/v1/buildingInsights:findClosest 6
Auth Provider: Firebase Auth (Phone + WebAuthn)
Database: Cloud Firestore (Native Mode)
Offline Key: enableMultiTabIndexedDbPersistence() 9
Tone Enforcement Model: OpenAI GPT-4o via API 8

PAGE NAMES 
About Us	PUBLIC	P-01
Our Services	PUBLIC	P-02
Our Process	PUBLIC	P-03
Financing	PUBLIC	P-04
Contact	PUBLIC	P-05
Login Page	PUBLIC	P-06
Password Reset	PUBLIC	P-07
PUBLIC ESTIMATE TOOL	PUBLIC	P-08
CONTRACTOR SIGNUP	PUBLIC	P-09
PUBLIC CAREERS	PUBLIC	P-10
JOB APPLICATION	PUBLIC	P-11
ESTIMATE TOOL	PUBLIC	P-12
		
Admin Dashboard	ADMIN PORTAL	A-01
User Management	ADMIN PORTAL	A-02
ESTIMATE PRICING	ADMIN PORTAL	A-03
ESTIMATE BACK END + API	ADMIN PORTAL	A-04
LINE ITEM CATALOG	ADMIN PORTAL	A-05
LINE ITEM PROFILE	ADMIN PORTAL	A-06
		
		
		
		
Employee Dashboard	Employee	E-01
GLOBAL NAV - CUSTOMER LOOKUP	ADMIN PORTAL	E-02
CUSTOMER INPUT PAGE	ADMIN PORTAL	E-02a
AI ASSISTANT (GLOBAL)	Employee	E-03
CALENDAR	Employee	E-04
PIPELINE	Employee	E-05
CUSTOMER PROJECT MAP	Employee/Contractor	E-06
MY ACCOUNTS (CRM)	Employee	E-07
ACCOUNT PROFILE	Employee	E-08
MY CONTACTS (CRM)	Employee	E-09
CONTACT PROFILE	Employee	E-10
MY PROPERTIES (CRM)	Employee	E-11
PROPERTY PROFILE	Employee	E-12
 	Employee	E-13
PROJECT HUB	Employee	E-14
PROJECT PROFILE	Employee	E-15
INCOME ACTIONATOR	Employee	E-16
COMMISSION COMPASS	Employee	E-17
REPORT BUILDER	Employee	E-18
LINE ITEM CATALOG	Employee	E-19
LINE ITEM PROFILE	Employee	E-20
MY INFO	Employee	E-21
EMPLOYEE TIMEOFF	Employee	E-22
QUOTE BUILDER TOOL	Employee	E-23
CONTACTS/VENDORS	ADMIN PORTAL	E-24
CONTACT/VENDOR PROFILES	ADMIN PORTAL	E-25
LEAD STAGE PAGE	Employee	E-26
ESTIMATE STAGE PAGE	Employee	E-27
QUOTE STAGE PAGE	Employee	E-28
SIGN & VERIFY PAGE	Employee/Customer	E-29
SCHEDULE STAGE PAGE	Employee	E-30
PRE INSTALLATION STAGE PAGE	Employee	E-31
INSTALL STAGE PAGE	Employee	E-32
PUNCH LIST STAGE PAGE	Employee	E-33
INVOICING STAGE PAGE	Employee	E-34
PAYMENTS modular PAGE	Employee	E-35
COMPLETED STAGE PAGE	Employee	E-36
PAST CUSTOMER STAGE PAGE	Employee	E-37
WEATHER GUIDE WIDGET	Employee	E-38
		
		
		
		
		
		
Customer Homepage	CUSTOMER	C-01
MY PROJECTS	Customer	C-02
CUSTOMER PROJECT PROFILE	Customer	C-03
MY PROFILE	Customer	C-04
		
		
Contractor Homepage	CONTRACTOR	CO-01
ONBOARDING	CONTRACTOR	CO-02
MY PROFILE & DOCS	CONTRACTOR	CO-03
MY SERVICES & PRICING	CONTRACTOR	CO-04
AVAILABLE JOBS	CONTRACTOR	CO-05
MY JOBS	CONTRACTOR	CO-06
MY PAYMENTS	CONTRACTOR	CO-07
Contractor Map	Outside Canvasser	CO-08
		
		
		
		
Supplier Homepage	Supplier	S-01
MY PRICE LISTS	Supplier	S-02
PURCHASE ORDERS	Supplier	S-03
MY COMPANY PROFILE	Supplier	S-04
*/