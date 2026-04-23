# RHIVE Construction "Honey" Callbot Architecture (JustCall)

## System Overview
"Honey" is the fully automated, inbound AI callbot designed to replace the legacy IVR system in JustCall. The primary objective is to streamline lead triage while ensuring zero administrative waste and maintaining a premium, "Zero Surprises" customer experience.

### Core Objectives
1. **Data Capture & Identity:** Quickly capture Name and Address via NLP and verify accuracy via text if necessary (Omni-Channel Pivot).
2. **Intent Triage:** Categorize calls dynamically (e.g., active leak vs. replacement quote).
3. **Frictionless Handoff:** Route to the specific operational team or automate remote quotes securely.
4. **Psychometric Tagging:** Use the Omni-Bird framework to gauge user intent (Eagle/Speed, Owl/Data, Dove/Safety, Parrot/Social) to prepare the sales team immediately.
5. **Technical Deflection Protocol:** Refuse to debate specific structural application mechanics (e.g., underlayment thickness) with "Armchair Experts." Pivot conversations gracefully to the **Lifetime No-Leak Service Guarantee**.

---

## Part 1: Core Process Stages (The 11 Nodes)

### Stage 1: Initial Lead / Contact
* **Bot Goal:** Gather Property Address & First Name. Determine if active leak or roof age > 15 years.
* **Routing:** Push to an "Aerial Quote" flow (remote/efficient) if replacement, or to "Inspection Scheduling" if repairing. 

### Stage 2: Inspection Scheduled
* **Bot Goal:** Confirm 3-hour arrival window + advise of a 30-60 min "heads up" driver notification. Controls exceptions and missed appointments.

### Stage 3: Inspection Completed
* **Bot Goal:** Acknowledge completion, notify that the Project Design Specialist (PDS) is preparing the proposal, set timelines. 

### Stage 4: Proposal Presented
* **Bot Goal:** Field basic status questions, schedule dedicated proposal review sessions with the PDS.

### Stage 5: Contract Signed
* **Bot Goal:** Congratulate caller, transition seamlessly to the Onboarding team. 

### Stage 6: Materials Ordered
* **Bot Goal:** Proactively broadcast real-time supply chain updates/delays to alleviate caller anxiety "Zero Surprises".

### Stage 7: Scheduling & Logistics
* **Bot Goal:** Re-verify start dates and crucial logistical prep (like driveway access/moving vehicles out of dumpster range).

### Stage 8: Project Execution
* **Bot Goal:** Manage active build check-ins. Route specific technical/tactical issues to the site supervisor *only* over critical issues.

### Stage 9: Project Completion
* **Bot Goal:** Verify job end, initiate the final walkthrough, solicit the final 10% payment.

### Stage 10: Warranty & Maintenance
* **Bot Goal:** Authenticate warranty profiles. Direct claims reliably to the service team based on process mapping.

### Stage 11: Dispute & Escalation Resolution
* **Bot Goal:** Identify high stress/anger correctly. Use advanced empathy protocols ("I completely understand your frustration") and issue an immediate blind-transfer strictly to a manager queue.

---

## Part 2: Complex Edge Cases & Technical Deflection 

### 12. The Post-Storm Emergency (Panic)
* **Strategy:** Skip standard sales pitch. Comfort caller, promise zero leak protection, push immediately to emergency tarp crew dispatch schedule.

### 13. Commercial Property Manager Call
* **Strategy:** Upon hitting keywords ("apartment," "tenant," "commercial"), skip regular residential array flow, query unit scale/timelines, and route to the internal Commercial Division. 

### 14. Price Shopper ("Price per square")
* **Strategy:** Implement the "Efficiency Credit Anchor". No blind quotes. Emphasize that remote quotes via aerial measure cut down administrative waste and save money natively. Let aerial measurement take point remotely.

### 15. Insurance Adjuster / Client Confusion
* **Strategy:** Reassure caller that RHIVE handles complex paperwork/ACV vs RCV processes constantly. Flag account as "Insurance" and route to supplements specialist.

### 16. Residential Solar Arrays
* **Strategy:** Catch the word "Solar" -> Flag the CRM for "Electrical D/C Solar Detach" protocol -> Assure them authorized electricians handle the re-roof solar unmounting natively.

### 17. The Armchair Expert 
* **Strategy:** Decline to be baited entirely. When interrogated on 6-nail patterns vs synthetic ridges, prioritize outcome. Example script: _"Our crews adhere strictly to manufacturer specifications for every build, but what's most important is the result: every roof we install comes with a lifetime no-leak service guarantee..."_

### 18. Realtor Urgent Closing Rush
* **Strategy:** Acknowledge time scale ("We close in 48 hours") -> Bypass regular queue -> Route specifically to "Fast-Tracked Expedited Operations". 

### 19. Warranty Transfers (New Ownership)
* **Strategy:** Identify caller as a new owner, scrape email via text, send Warranty Portal auto-link instantly via SMS.

### 20. Off-Hour / After-Hours Call 
* **Strategy:** Inform them out of service operating hours. Classify severity -> Request Aerial Pull asynchronously or set Priority 1 Ticket queue for Dispatch opening at 7:00 AM. 

### 21. Spam & Telemarketing
* **Strategy:** Sniff out non-client SEO/Sales agents. Standard dismissal: "We are not receiving vendor inquiries." Immediately terminate the line. 

---

## Part 3: Operational Optimization Mechanisms 

* **The Omni-Channel Pivot (SMS Failsafe)**: When voice/connection fails during data intake, bot hangs up via webhook "I think we have a connection issue...", firing a pre-authorized automated SMS requesting the address cleanly in text format. 
* **Omni-Bird Matrix Extraction**: 
    1. **Eagle (Speed)**: Wants it now, urgent. Route: Results driven. 
    2. **Owl (Data)**: Process focused, questions about specs. Route: Detail-oriented.
    3. **Dove (Safety)**: Cares about guarantees, "Safe", lifetime warranty. Route: Care and assurance.
    4. **Parrot (Aesthetics)**: Look, curb appeal, HOA. Route: Design centric pitch. 

System readiness confirmed at 100%. Ready to proceed with build engineering or JustCall logic routing validation.
