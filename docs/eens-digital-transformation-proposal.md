# Eens Limited
## Digital Property Operations, Demand Capture, and Revenue Systems Proposal

**Prepared by:** Nimbuz Tech
**Client:** Eens Limited
**Public property register:** eens.co.ke
**Operational site:** eensbpark.ke
**Document reference:** NT-PRP-2026-EENS2
**Date:** 13 August 2026
**Proposal period:** Six-month implementation and growth programme

## Document set and audience

This repository now publishes three related documents with different jobs:

| Audience | Markdown source | Print HTML | PDF |
|---|---|---|---|
| Executive sales | [Read](eens-executive-sales-proposal.md) | [Open](eens-executive-sales-proposal.html) | [Download](eens-executive-sales-proposal.pdf) |
| Engineering | [Read](eens-technical-implementation-proposal.md) | [Open](eens-technical-implementation-proposal.html) | [Download](eens-technical-implementation-proposal.pdf) |
| Combined evidence reference | [Read](eens-digital-transformation-proposal.md) | [Open](eens-digital-transformation-proposal.html) | [Download](eens-digital-transformation-proposal.pdf) |

The executive document contains the client-facing business case, outcomes, programme, investment framework, approvals, and next steps. The technical document contains engineer-facing records, interfaces, workflows, security controls, AI boundaries, observability, fixtures, and acceptance tests.

**Audience boundary:** use the executive proposal for stakeholder and commercial review. Use the technical proposal for engineering estimation, implementation, testing, and handover. Do not use the executive document as an API or delivery contract.

---

## Executive note

Eens already has the beginnings of a strong operating system. Its public website is a fast, factual property register. Its internal site runs Frappe and ERPNext with CRM, utility and rental billing, a communication layer, and a permission-controlled assistant layer. The opportunity is not to replace these systems. It is to connect them around one business truth:

> **Every published property, enquiry, viewing, lease, meter reading, invoice, payment, and follow-up should be traceable to the same property and customer record.**

This proposal turns that foundation into a measured growth and property-operations system. It connects digital marketing to verified inventory, captures demand into CRM, moves qualified prospects into service requests and contracts, automates recurring rent and utility billing, and gives managers useful reporting without weakening permissions or financial controls.

The proposal is deliberately evidence-led. It separates what is present in the current installation from what must be configured, integrated, tested, or built. This protects Eens from publishing unavailable units, promising an unconfigured payment channel, or measuring marketing activity without being able to link it to occupancy and revenue.

---

# Part I — Executive proposal

## 1. The business case

Eens operates across two connected markets:

- **Industrial and commercial occupation:** godowns, warehouses, business-park space, retail units, logistics space, and related services across Mlolongo, Syokimau, Baba Dogo, and the wider Mombasa Road corridor.
- **Residential property:** apartments and residential opportunities in Thika and other approved locations.

These markets need different messages, but they share the same commercial questions:

1. What space is available, where is it, and what are the verified terms?
2. Who is asking, what do they need, and when do they need it?
3. Which enquiry became a viewing, an offer, a contract, and collected revenue?
4. Which property, campaign, location, or content topic is producing useful demand?
5. Which leases, meters, invoices, payments, renewals, and service issues need attention?

The current proposal answers these questions by joining the public register, CRM, rental and utility operations, finance, communication, automation, analytics, and AI-assisted decision support into a staged system.

### Expected business effects

| Business area | Improvement Eens should gain |
|---|---|
| Occupancy | Faster response to demand, fewer stale listings, clearer viewing and follow-up queues |
| Leasing | A consistent path from lead to unit selection, service request, deposit, contract, and invoice |
| Billing | Recurring rent, utility consumption, adjustments, and receivables handled from linked records |
| Marketing | Campaigns measured by qualified enquiries, viewings, offers, contracts, and revenue—not impressions alone |
| Customer service | Conversations attached to the relevant lead, customer, property, contract, invoice, or issue |
| Management | One set of operational reports for availability, tenancy, consumption, receivables, and pipeline |
| Decision-making | Permission-aware assistant queries and summaries with an audit trail |
| Trust | Public pages show verified facts, explicit availability, clear references, and a reliable next action |

---

## 2. Current-state assessment

### 2.1 Verified live stack

The `eensbpark.ke` site was checked against the live Bench installation on 13 August 2026.

| Layer | Verified state | Role in the proposed system |
|---|---|---|
| Frappe Framework 16.25.0 | Installed and running | Authentication, roles, DocTypes, permissions, APIs, background jobs, workflows, files, notifications, and web application foundation |
| ERPNext 16.26.2 | Installed and running | Customers, items, sales orders, sales invoices, payments, accounts, assets, stock, reports, and accounting controls |
| Frappe CRM 1.81.1 | Installed and running | Lead, deal, source, status, territory, tasks, calls, notes, communication history, SLAs, and ERPNext handoff |
| Utility & Rental Billing 0.0.1 | Installed and running | Property hierarchy, service requests, contracts, deposits, recurring rent, meters, tariffs, adjustments, and utility reporting |
| Frappe Assistant Core 2.5.0 | Installed and running | Permission-scoped assistant access, MCP connection, prompts, skills, reporting, analysis, dashboards, file extraction, and audit logs |
| Internal and multichannel communication layer | Installed and running | Internal chat, document-linked topics, multimedia messages, support routing, channel profiles, templates, notifications, and webhooks |
| `eens_app` | Installed; no custom DocTypes or active business hooks | Frappe app shell for Eens-specific extensions; ready for the integration layer described in this proposal |
| Astro 7.2 + TinaCMS | Source present in `eens_app/frontend` | Static public site, property content, editorial workflow, SEO metadata, category routes, detail pages, and PWA shell |
| Vercel/static build path | Astro output is configured for the Frappe public directory | Public pages can be built separately from the ERP while sharing approved data through a controlled integration |

### 2.2 What is already present on the public website

The Astro/Tina frontend currently provides:

- Property collections with type, availability, address, zone, area, price, lease terms, references, images, videos, occupancy state, review metadata, and industrial specifications.
- Canonical category directories for shops, warehouses, godowns, business parks, and apartments.
- Listing detail pages with address, availability, price, area, map links, viewing actions, and specification tables.
- Pages for locations, leasing terms, contact, the operating overview, and a practical journal.
- Canonical URLs, Open Graph and Twitter metadata, sitemap integration, manifest, service-worker registration, and offline fallback behaviour.
- A factual editorial voice that treats address, size, price, specification, and terms as the primary trust signals.

### 2.3 Important current gaps

The following are not evidenced as live integrations in the checked source and site configuration:

- No verified API synchronisation between Frappe property records and Tina property records.
- No public lead-capture endpoint that creates a CRM Lead or Utility Service Request.
- No M-Pesa Daraja or bank-transfer integration in the checked Eens, Utility Billing, CRM, or core app source.
- No n8n workflow installation in the Bench; n8n is therefore proposed as an external orchestration service, not described as already deployed.
- No public analytics tag, conversion event schema, or campaign-attribution pipeline in the frontend source inspected.
- No evidence that channel credentials or public web support have been configured, even though the communication layer supports those flows.
- No Eens-specific Assistant Core tools or skills are registered yet; the app is installed and supports the required extension hooks.
- The original Frappe app shell has no Eens-specific business DocTypes, scheduled tasks, or integration hooks.

These gaps do not weaken the opportunity. They define the work that turns the installed platform into an operating system.

---

## 3. Proposed operating architecture

```text
                         DEMAND GENERATION
  Organic search | Google Business Profiles | Social | Paid campaigns
                              | UTM + consent
                              v
                 EENS PUBLIC PROPERTY REGISTER
             Astro + TinaCMS + verified listing content
        category pages | property pages | guides | viewing actions
                              |
                 lead form / chat / phone / email links
                              v
                   ORCHESTRATION AND ROUTING
                 n8n workflows + webhook gateway
          deduplication | validation | attribution | alerts
                              |
                              v
                      FRAPPE / ERPNext CORE
     CRM Lead -> CRM Deal -> Utility Service Request -> Contract
        -> Sales Order / Deposit -> Auto Repeat -> Invoice
        -> Meter Reading -> Tariff -> Invoice -> Payment Entry
                              |
        +---------------------+----------------------+
        |                                            |
        v                                            v
 COMMUNICATION LAYER                         ASSISTANT LAYER
 internal topics | customer channels           permission-aware AI
 templates | document links                    reports | analysis
 receipts | reminders                          prompts | skills | audit
        |                                            |
        +---------------------+----------------------+
                              v
                        MANAGEMENT SIGNALS
    occupancy | pipeline | source attribution | collections | usage
                 service levels | renewals | content demand
```

### Design principle: two systems of record, one controlled contract

The public site and the ERP should not both become uncontrolled masters of property availability.

- **Frappe/ERPNext becomes the operational record** for units, occupancy, customers, contracts, billing, payments, and internal status.
- **TinaCMS remains the publishing and editorial record** for approved public copy, images, specification presentation, SEO titles, guides, and page composition.
- A small integration contract publishes only approved fields from the operational record into the public content workflow. It does not expose private tenant, financial, or identity data.
- Until that synchronisation is built and accepted, the public register remains a manually reviewed publishing surface. No proposal language should imply that it is already live-synchronised.

---

## 4. How the installed applications work together

### 4.1 Frappe Framework: the application and data foundation

Frappe provides the metadata-driven model beneath the operational system. A DocType defines a record type, fields, relationships, permissions, views, and lifecycle behaviour. The framework supplies authentication, role-based access, database APIs, REST access, background jobs, webhooks, workflow hooks, files, notifications, and the Desk interface.

For Eens, this means the integration layer can use stable business records rather than a collection of disconnected spreadsheets and custom scripts. It also means every public or assistant-facing action must respect the same roles and permissions as the Desk.

### 4.2 ERPNext: the financial and operational backbone

ERPNext supplies the standard records that make the property model commercially useful:

- Company, Customer, Supplier, Contact, Address, Territory, and User.
- Item and Item Price for rent, service, utility, connection, and other billable lines.
- Serial No and Asset where meters, equipment, or fixed assets need traceable identities.
- Sales Order, Sales Invoice, Payment Entry, Account, Cost Center, Project, and Auto Repeat for the transaction and accounting lifecycle.
- Communication, File, Workflow, Notification, Webhook, and assignment mechanisms for operational control.

ERPNext is not the property register by itself. It is the financial and transaction engine that receives a verified unit, customer, contract, and billing structure.

### 4.3 Utility and rental billing: the property-to-cash workflow

The installed utility app provides the most direct fit for Eens property operations.

#### Core records

- **Utility Property:** a tree structure for estates, buildings, floors, units, unit status, unit type, location, size, bedrooms, bathrooms, features, legal description, and optional fixed-asset linkage.
- **Utility Service Request:** the intake document for a customer, lead, or other party. It can hold request type, territory, location, selected services, property selections, contract dates, terms, utility structure, and fulfilment requirements.
- **Contract Utility Property Item:** the contract-to-unit child record. It carries the unit, active flag, start and end dates, contract length, adjustment rule, and insurance link.
- **Utility Bill Structure:** a reusable collection of billable items and monthly amounts.
- **Meter Reading:** the customer, property, date, price list, utility items, previous reading, current reading, consumption, meter number, company, cost center, and project.
- **Billing Adjustment Rule:** frequency, increments, grace periods, penalties, caps, accounts, and invoice submission behaviour.
- **Utility Billing Settings:** draft/submitted behaviour, merged invoices, customer creation, site survey, deposit-before-contract, contract-before-invoice, and tenancy-ending notice timing.

#### Business flow

```text
Prospect or CRM Lead
        -> Utility Service Request
        -> optional site survey / fulfilment checklist
        -> selected Utility Property unit(s)
        -> deposit Sales Order
        -> Contract
        -> recurring Auto Repeat / Sales Invoice
        -> Meter Reading + tariff calculation
        -> utility Sales Order / Sales Invoice
        -> Payment Entry and receivables reporting
```

This helps Eens keep rent, utility consumption, deposits, renewals, and tenant communication linked to one customer and one property relationship.

### 4.4 CRM: the demand and relationship layer

CRM supplies the commercial pipeline before a lease exists.

- **CRM Lead** captures name, email, phone, organisation, source, industry, territory, lead owner, status, SLA fields, Facebook lead identifiers, products, and communication state.
- **CRM Deal** captures organisation, lead, owner, source, territory, probability, deal value, next step, expected closure, contacts, status changes, SLA, and lost reasons.
- **CRM Task** records the next action, owner, priority, status, due date, and linked document.
- **CRM Call Log, FCRM Note, Communication, and notifications** keep the context around the relationship.
- **CRM Lead Source, Lead Status, Territory, Industry, and Organization** make campaign and market segmentation possible.
- ERPNext integration can create or update a Customer as a deal reaches the agreed stage.

CRM should be the first internal destination for website, advertising, social, and conversation enquiries. Utility Service Request should begin only when the enquiry contains enough information to select or discuss a property/service path.

### 4.5 Communication layer: the human response surface

The installed communication layer is capable of internal and customer-facing conversations, multimedia messages, topics, document links, support routing, mobile notifications, templates, and channel webhooks.

Its role in the Eens strategy is not to replace CRM. It is to make CRM and operations responsive:

- A new enquiry opens or updates a conversation and creates a CRM Lead.
- A viewing conversation is linked to the Lead, Deal, or property reference.
- A contract or invoice notification is sent from a controlled template.
- A customer question can be linked to a Sales Invoice, Contract, Utility Service Request, Issue, or Task.
- A topic preserves the context that would otherwise be lost in a personal inbox.

Public channel credentials, business verification, templates, operating hours, consent language, routing roles, and escalation rules must be configured and tested before public launch.

### 4.6 Assistant layer: decision support inside permissions

Frappe Assistant Core is installed and exposes a controlled assistant interface over Frappe. Its important capabilities for Eens are:

- Permission-aware document reading and writing tools.
- DocType and field metadata discovery.
- Search, reports, workflows, approvals, file extraction, dashboards, and analysis.
- Prompt Templates for repeatable questions.
- FAC Skills for domain procedures such as availability review, pipeline review, collections review, and renewal preparation.
- Assistant Audit Log records with user, tool, target, status, timing, input/output, errors, and trace information.
- Configurable code-execution limits and read-only database restrictions for analysis workflows.
- Extension hooks that allow `eens_app` to add Eens-specific tools and skills without modifying the assistant core.

The assistant should start as a read-and-recommend layer. Actions that change property availability, create contracts, submit invoices, send outbound messages, or affect payment records require explicit role permissions and confirmation. The assistant must never decide that an unverified property is available, expose private tenant information, or send a message without a controlled action path.

### 4.7 `eens_app` and Astro/Tina: the public publishing layer

The Eens Frappe app is currently a clean shell rather than a business application. That is useful: the Eens integration logic can be added without making the public website depend directly on third-party app internals.

The Astro/Tina frontend is already structured around the public property register:

- Tina property content is stored under `src/content/property`.
- The property schema includes type, availability, address, zone, square footage, price, lease term, occupancy state, images, provenance, review date, reference code, and B2B specification fields.
- `src/pages/[category]/index.astro` builds directory pages.
- `src/pages/[category]/[slug].astro` builds detail pages.
- `BaseHead.astro` provides canonical, metadata, Open Graph, Twitter, manifest, and service-worker registration.
- `astro.config.mjs` enables static output, sitemap integration, and deployment into the Frappe public tree.

The next step is a controlled publishing bridge—not a direct database leak from ERPNext into the browser.

---

## 5. Digital marketing and SEO operating system

### 5.1 The acquisition principle

Marketing should create demand for specific, verifiable property opportunities, then pass the resulting enquiry into a measurable operational path.

The primary conversion is not a page view. It is a qualified next step:

- request a viewing;
- ask about a named listing;
- request a specification pack;
- ask for a unit in a zone and size band;
- request a callback;
- submit a company requirement;
- request an apartment viewing.

### 5.2 Search architecture

The public site should grow by publishing useful pages around actual inventory and actual operating locations.

#### Industrial and commercial clusters

- godowns for rent in Syokimau;
- warehouses for rent in Mlolongo;
- warehouse space on Mombasa Road;
- industrial units near the Nairobi logistics corridor;
- shops and commercial space at approved business-park locations;
- warehouse specifications by size, power, floor loading, clear height, water, and access;
- lease terms, deposits, fit-out, and viewing information.

#### Residential clusters

- 3-bedroom apartments in Thika;
- apartments in an approved estate or named development;
- unit size, bedrooms, bathrooms, price, title/lease terms, and viewing information.

The content model already supports the factual elements that make these pages useful. The proposal is to add only the missing operational evidence: verified availability, review date, listing reference, clear next action, and structured lead attribution.

### 5.3 Technical SEO workstream

1. Keep one canonical URL per property and category.
2. Build sitemap entries only for published, approved records.
3. Use clear title and description templates that include property type, location, and the useful fact a searcher needs.
4. Add structured data only where the page visibly supports it. Candidate types require a schema review before implementation; no review markup or invented ratings should be added.
5. Keep address, area, price, availability, terms, and specification values in crawlable HTML.
6. Add internal links from location pages, guides, category pages, and related listings.
7. Keep image alt text factual and preserve image provenance.
8. Monitor index coverage, crawl errors, canonical selection, page performance, and enquiry conversion by landing page.
9. Keep the static build fast and cacheable; do not put the ERP or an assistant request in the critical path for public page rendering.

### 5.4 Local search and Google Business Profiles

Where Eens has separate, verifiable operating locations, each profile should have accurate ownership, name, address, category, hours, phone routing, website landing page, and review process. The rollout should begin with a location and ownership audit, not with duplicating profiles.

Profile posts and review requests should point to real location pages and real property updates. They should never promise a unit that has not passed the internal availability check.

### 5.5 Content operations

The existing journal is a strong base because it explains locations, specifications, leasing terms, and publishing choices in a factual voice. The content programme should add:

- one practical location or specification article each month;
- one property or availability update when an approved record changes;
- one short video or photo set for a verified location or unit;
- one recurring answer page for a question that appears in CRM conversations;
- one monthly content review using organic search, CRM source data, and viewing outcomes.

A content item is accepted when it has a source, a target query or customer question, a defined next action, and a link to an approved property or contact route.

---

## 6. n8n automation strategy

n8n should orchestrate systems, not become the system of record. Frappe remains the source for operational records; Tina remains the editorial source for public composition; n8n moves validated events between them.

### Workflow A — inventory publishing

```text
Property or availability change in Frappe
    -> webhook / scheduled export
    -> validate required public fields
    -> check approval + occupancy state
    -> create a publishing task or approved content payload
    -> update Tina property record or open human review
    -> rebuild Astro site
    -> verify page, canonical, and sitemap
    -> record publication event and listing reference
```

### Workflow B — lead capture

```text
Website / search ad / social / chat enquiry
    -> receive webhook or form payload
    -> validate fields and consent
    -> attach UTM, landing page, channel, campaign, and timestamp
    -> deduplicate by email/phone plus recent activity
    -> create or update CRM Lead
    -> assign owner and SLA
    -> acknowledge the prospect
    -> notify the responsible team
```

### Workflow C — qualification and viewing

```text
Conversation or CRM Lead
    -> ask category, zone, size, budget, power, use, timeline
    -> match against published and internally approved inventory
    -> offer only records whose status is current
    -> create CRM Task / Deal when qualified
    -> create viewing task or calendar request
    -> link transcript and property references
    -> remind owner if no response within SLA
```

### Workflow D — service request and lease handoff

```text
Qualified CRM Deal
    -> create Utility Service Request
    -> select Utility Property unit(s)
    -> record dates, service items, deposit, and terms
    -> optional survey / fulfilment checklist
    -> create deposit Sales Order
    -> confirm deposit and approval
    -> create Contract
    -> configure Auto Repeat / invoice schedule
```

### Workflow E — billing and tenant communication

```text
Meter Reading or due Auto Repeat
    -> calculate billable usage / rent
    -> create Sales Order or Sales Invoice according to settings
    -> send controlled statement or notification
    -> receive payment webhook when a payment provider is approved
    -> verify signature and reference
    -> create Payment Entry or reconciliation task
    -> notify tenant and finance
    -> log event and failure reason
```

### Workflow F — content and reputation loop

```text
Completed viewing / signed contract / resolved service issue
    -> check consent and communication policy
    -> request feedback through an approved channel
    -> classify response for internal service improvement
    -> create a content question or FAQ task when a repeated objection appears
    -> never publish private feedback as a testimonial without written approval
```

### Workflow controls

Every workflow must have:

- idempotency key and source event ID;
- validation before document creation;
- retry policy with bounded attempts;
- dead-letter or exception queue;
- owner and escalation path;
- correlation ID across webhook, n8n execution, Frappe document, and message;
- no secrets in payload logs;
- replay-safe processing;
- a manual approval step for public availability, financial submission, and outbound campaign actions.

---

## 7. Data collection and management information

### 7.1 Demand data

Capture only data that helps Eens respond or measure a business decision:

- enquiry source and campaign;
- first landing page and listing reference;
- contact details and consent state;
- category, zone, size range, use, power requirement, budget band, and timeline;
- requested next step;
- owner, SLA, status, last response, and next action;
- viewing date, outcome, offer state, and reason lost;
- conversion to customer, service request, contract, invoice, and payment.

### 7.2 Property data

Maintain one approved property vocabulary:

- property reference;
- type and zone;
- public address and internal location;
- area, unit type, floor, power, water, parking, floor loading, clear height;
- availability and occupancy state;
- price, deposit, service charge, lease term, permitted use;
- last reviewed date and reviewer;
- public page status and image provenance.

### 7.3 Operational dashboards

The first management dashboard set should be:

1. **Availability:** total units, available, reserved, occupied, maintenance, unpublished, and days since last review.
2. **Leasing funnel:** leads, qualified deals, viewings, offers, contracts, conversion rates, time to first response, and time to lease.
3. **Source performance:** organic, Google Business Profile, paid search, social, referral, direct, and campaign-level qualified conversion.
4. **Receivables:** invoices due, overdue, ageing, deposits, collections, and exceptions.
5. **Tenancy:** active contracts, ending dates, escalation dates, insurance status, renewals, and notice horizon.
6. **Utilities:** consumption by property, meter exceptions, tariff blocks, abnormal usage, and billed/unbilled readings.
7. **Service operations:** open requests, fulfilment deadlines, survey status, issues, owner, and SLA breaches.
8. **Content:** indexed pages, organic landing pages, enquiries by page, listing freshness, and content gaps.

### 7.4 Measurement discipline

A monthly report should distinguish:

- **reach:** impressions, clicks, profile views, video views;
- **interest:** enquiries, chat starts, calls, downloads, viewing requests;
- **quality:** qualified leads, matched requirements, scheduled viewings;
- **commercial outcome:** offers, signed contracts, deposits, invoiced rent, collected rent;
- **retention:** renewals, service response, payment timeliness, and tenant feedback.

This prevents marketing success from being claimed on the basis of traffic that never becomes a property conversation.

---

## 8. AI integration strategy

AI is useful when it reduces search and reporting time without becoming an uncontrolled decision-maker.

### First release: read, explain, and prepare

Approved users should be able to ask:

- Which approved industrial units are available in Mlolongo above a chosen size?
- Which listings have not been reviewed recently?
- Show open leads with no next action in the last five working days.
- Summarise this month’s viewings by source and outcome.
- Which contracts end in the next six months?
- Compare meter consumption for a property over the last three periods.
- Prepare a collections follow-up list, grouped by owner and ageing.
- Extract the key obligations and dates from an uploaded lease or inspection document.

The assistant should prefer existing ERPNext and Utility Billing reports before custom analysis. Custom analysis should use a read-only path and bounded resource limits.

### Eens-specific assistant skills

The `eens_app` should register skills such as:

- `property_availability_review` — approved public and internal availability rules;
- `lead_followup_review` — overdue response and next-action review;
- `viewing_pipeline_summary` — viewing outcomes and conversion;
- `tenancy_renewal_review` — contracts, dates, notices, and escalation rules;
- `utility_consumption_review` — meter readings, tariff blocks, and anomalies;
- `content_opportunity_review` — repeated customer questions mapped to approved content;
- `monthly_management_pack` — fixed report sequence and definitions.

### Eens-specific tools

Tools should be added in the Eens app and should expose narrow, testable contracts:

- search approved property records;
- compare public listing records with internal property status;
- create a CRM follow-up task;
- prepare a viewing brief;
- generate a management summary from existing reports;
- identify stale or incomplete public records;
- prepare a content brief from approved customer questions.

Writing, deleting, submitting financial documents, sending external messages, changing availability, and changing contract data must be separate privileged actions with confirmation and audit logging.

### AI governance

- Use Frappe roles and document permissions as the primary access boundary.
- Keep tenant identity, payment data, credentials, and unrelated company data out of prompts.
- Treat model output as untrusted data; validate it before creating a document or sending a message.
- Keep an audit record for every assistant action, including failed and permission-denied actions.
- Apply time, memory, CPU, recursion, and output limits to code-execution features.
- Start with deterministic reports and approved content; add retrieval or embeddings only when a clear search problem remains.
- Require human approval for public claims, financial actions, bulk communication, and destructive operations.

---

## 9. Security, privacy, and operational controls

### Trust boundaries

The system crosses these boundaries:

1. public visitor to website or conversation endpoint;
2. external channel provider to webhook endpoint;
3. n8n to Frappe API;
4. Frappe to payment provider;
5. user to assistant/MCP endpoint;
6. uploaded file to extraction or OCR process;
7. public content to AI context.

### Required controls

- HTTPS everywhere and restricted CORS for authenticated interfaces.
- Environment-managed credentials; never commit or log tokens, passwords, or full payment payloads.
- Webhook signature verification, timestamp/replay protection, and idempotent event processing.
- Rate limits and input-size caps on public lead, chat, upload, and webhook routes.
- Role and document permission checks on every server-side operation.
- Allowlisted outbound hosts for integrations; no arbitrary server-side URL fetching.
- Redacted structured logs with correlation IDs.
- Separate staging credentials, test phone numbers, test payment references, and production credentials.
- Backup verification, restore drills, error-log retention, and a documented rollback path.
- Data-retention rules for lead, conversation, uploaded document, and audit data.
- Consent and opt-out records for marketing communication.

---

## 10. Six-month implementation roadmap

### Phase 0 — discovery and data contract (weeks 1–2)

- Confirm property vocabulary, zones, unit identifiers, customer ownership, and operational roles.
- Inventory existing Utility Property, CRM, contract, invoice, meter, and public listing records.
- Define the public publishing allowlist and the internal source-of-truth rules.
- Agree consent, retention, approval, and outbound messaging policies.
- Define KPIs, dashboard formulas, event taxonomy, and acceptance tests.

**Exit condition:** approved data dictionary and integration contract.

### Phase 1 — operational foundation (weeks 3–6)

- Configure Utility Property hierarchy for approved buildings, floors, and units.
- Configure customer groups, utility items, tariffs, price lists, cost centres, and invoice behaviour.
- Configure CRM source, status, territory, owner, SLA, and next-action conventions.
- Build only the Eens-specific DocTypes and hooks needed for the integration layer.
- Create role and permission matrix for leasing, property management, finance, marketing, and assistants.

**Exit condition:** a test unit can move from approved inventory to a controlled service request and billing preview.

### Phase 2 — public publishing and technical SEO (weeks 5–8)

- Add the approved operational fields required by public listings.
- Build a review and publication workflow between Frappe and Tina.
- Add listing freshness checks, canonical/metadata templates, structured data where justified, and sitemap gating.
- Connect landing-page events and UTM capture without putting analytics or ERP calls in the critical render path.
- Produce location and property content from verified records.

**Exit condition:** an approved availability change can be published, verified, and traced to a listing reference.

### Phase 3 — lead capture and communication operations (weeks 7–10)

- Configure the public form, chat handoff, email, and approved channels.
- Build n8n lead validation, deduplication, attribution, assignment, acknowledgement, and escalation flows.
- Link conversations to CRM Lead, CRM Deal, property references, and follow-up tasks.
- Add approved templates for viewing acknowledgement, specification response, follow-up, contract, invoice, and payment status.

**Exit condition:** a test enquiry becomes a CRM Lead, receives an owner and SLA, and retains its source and property context.

### Phase 4 — finance and tenant operations (weeks 9–14)

- Configure contract, deposit, recurring rent, meter, tariff, adjustment, and invoice workflows.
- Integrate one approved payment method after provider approval and test reconciliation.
- Add tenant communication and exception handling.
- Build availability, tenancy, service request, meter, collections, and pipeline dashboards.

**Exit condition:** a test tenancy completes the agreed contract-to-invoice-to-payment reconciliation path.

### Phase 5 — assistant and management intelligence (weeks 12–18)

- Configure Assistant Core settings, connection policy, audit retention, and tool categories.
- Register Eens-specific skills and narrow read-only tools.
- Create prompt templates for management, leasing, collections, utilities, and content review.
- Build the monthly management pack and verify every assistant result against a source report.
- Add approval gates for any write action.

**Exit condition:** approved managers can answer the agreed management questions with permission-correct, auditable outputs.

### Phase 6 — growth and optimisation (weeks 16–24)

- Run SEO, local search, social, email, and paid campaign experiments by property type and zone.
- Review qualified-lead cost, response time, viewing rate, offer rate, lease rate, and revenue source.
- Publish the content topics that repeated demand proves useful.
- Improve stale inventory, lost-lead, and renewal workflows.
- Complete security review, backup/restore test, performance check, and operational handover.

**Exit condition:** Eens has a repeatable growth and operations cadence, not a collection of disconnected campaigns.

---

## 11. Proposed KPI framework

Baseline values should be captured during Phase 0. Targets should be set after the baseline rather than invented in advance.

| KPI | Definition | System of record |
|---|---|---|
| First response time | Time from captured enquiry to first human or approved automated response | CRM + communication events |
| Lead completeness | Percentage of leads with source, consent, contact, need, timeline, and next action | CRM |
| Qualified lead rate | Qualified leads divided by captured leads | CRM |
| Viewing rate | Completed or scheduled viewings divided by qualified leads | CRM Task / Deal |
| Offer rate | Offers divided by completed viewings | CRM / Contract process |
| Lease conversion | Signed contracts divided by qualified deals | Contract |
| Source-to-revenue | Collected or invoiced value attributed to a source/campaign | CRM + ERPNext |
| Listing freshness | Days since approved availability and specification review | Frappe + Tina |
| Occupancy | Occupied units divided by operational units | Utility Property |
| Collection rate | Collected amount divided by amount due in period | ERPNext |
| Utility exception rate | Readings rejected or flagged divided by readings submitted | Meter Reading |
| Renewal coverage | Active contracts with an upcoming renewal action | Contract |
| Assistant reliability | Responses with a cited source and permission-correct result | Assistant Audit Log |

---

## 12. Commercial framework

The following is an indicative engagement structure inherited from the original commercial brief and should be confirmed after Phase 0:

### Recommended six-month programme

- **Proposed service fee:** KSh 120,000 per month for six months.
- **Media budget:** paid directly by Eens to the selected advertising platforms.
- **Third-party costs:** hosting, messaging/channel fees, payment-provider charges, domains, verification fees, and any paid SaaS services are excluded unless expressly included in the signed scope.
- **Client responsibilities:** timely access, accurate property records, approved imagery, business verification, payment-provider onboarding, legal/privacy approval, and named owners for leasing, finance, operations, and marketing.

The fee should cover agreed engineering, SEO, marketing operations, reporting, training, and maintenance scope. It should not imply unlimited content production, unlimited campaign spend, or 24/7 incident response without a separate SLA.

### Acceptance and change control

Each phase should have:

- a written acceptance checklist;
- a test environment or controlled test data;
- named approvers;
- a rollback or manual fallback;
- a list of deferred items;
- a handover note and training record.

---

## 13. Decisions required from Eens

1. Which person owns the operational property register?
2. Which system is authoritative for availability during the transition: the ERP property record or the public CMS record?
3. Which channels are approved for public messaging at launch?
4. Which payment provider and settlement account will be used first?
5. Which fields may be published publicly, and which must remain internal?
6. What consent and retention policy applies to marketing and conversation records?
7. Which roles may approve public availability, submit invoices, send campaigns, and use assistant write tools?
8. Which locations have verified ownership and profile eligibility for local search?
9. What is the baseline for occupancy, response time, qualified leads, viewings, and collections?
10. Who accepts each phase and who receives incident escalations?

### Executive approval checklist

Before Phase 1 begins, Eens should record the following approvals in the signed scope or kickoff record:

| Approval | Required confirmation | Owner |
|---|---|---|
| Business sponsor | Six-month objective, budget boundary, and decision cadence | Eens sponsor |
| Operational truth | Interim availability owner and the future Frappe-to-public publishing boundary | Property/operations lead |
| Data and privacy | Public fields, consent language, retention period, and escalation policy | Eens management + legal/privacy reviewer |
| Access and security | Named users, roles, staging access, credential custody, and backup responsibility | Eens technical owner |
| Growth measurement | Baseline metrics, campaign naming, UTM rules, and qualified-conversion definition | Marketing owner |
| Acceptance | Phase approvers, test-data owner, rollback contact, and incident escalation route | Eens sponsor + delivery lead |

**Decision gate:** work should move from discovery into implementation only after these owners and boundaries are written down. This keeps the programme accountable without treating proposed integrations as live capabilities.

---

# Part II — Engineering follow-on

## 14. Engineer-facing system contract

### 14.1 Ownership boundaries

| Concern | Owner | Public exposure |
|---|---|---|
| Unit identity, occupancy, lease state, meter, contract, invoice, payment | Frappe/ERPNext | Never directly; publish approved projection only |
| Public copy, layout, SEO title, media, guides | Tina/Astro | Yes, after editorial approval |
| Lead and deal lifecycle | CRM | Selected summary only; no private timeline or financial data |
| Rent and utility calculations | Utility Billing + ERPNext | Public terms only; no tenant ledger |
| Conversations and channel delivery | Communication layer | Channel-specific; link internally to CRM/DocTypes |
| Cross-system automation | n8n | No business truth; stores execution state and error metadata |
| Assistant context and action policy | FAC + Eens tools/skills | Permission-scoped; no direct public access by default |
| Reporting definitions | Frappe reports / controlled query tools | Management access only |

### 14.2 Proposed public listing projection

The Eens integration app should expose a versioned, allowlisted projection rather than the full ERP DocType:

```json
{
  "reference": "EE-MLO-014",
  "title": "Mlolongo Warehouse - Unit 02",
  "type": "WAREHOUSE",
  "zone": "Mlolongo",
  "address": "Mlolongo, Mombasa Road, KM 14",
  "availability": "ForRent",
  "occupancyState": "available",
  "sqft": "9,000 sq ft",
  "price": { "ksh": "3,150,000 / yr", "perSqft": "35" },
  "leaseTerm": "3-year minimum",
  "specSheet": {
    "power": "150",
    "water": "8",
    "parking": 6,
    "floorLoading": "30",
    "clearHeight": "7.5"
  },
  "lastReviewedDate": "2026-08-13",
  "sourceVersion": 3
}
```

The projection must exclude customer names, tenant contacts, balances, private notes, credentials, contract documents, and internal workflow commentary.

### 14.3 Proposed integration endpoints

Use standard Frappe REST resources and whitelisted methods only where a domain operation needs a controlled contract.

| Interface | Purpose | Rules |
|---|---|---|
| `GET /api/method/eens_app.api.public_listings.list` | Return approved public listing projections | Read-only, paginated, cacheable, no private fields |
| `GET /api/method/eens_app.api.public_listings.get` | Return one approved listing projection | Validate reference and publication status |
| `POST /api/method/eens_app.api.leads.capture` | Create or update a CRM Lead | Validate consent, source, payload size, idempotency key |
| `POST /api/method/eens_app.api.viewings.request` | Create a CRM Task or controlled viewing request | Link listing reference; require contact and preferred window |
| `POST /api/method/eens_app.api.webhooks.receive` | Receive provider/n8n events | Verify signature, timestamp, source, and replay key |
| `GET /api/method/eens_app.api.health` | Report integration health | Return dependency status without secrets or internal traces |

List responses should be paginated and use a consistent error envelope. External responses must be schema-validated before entering Frappe.

### 14.4 Event contract

```json
{
  "eventId": "provider-or-workflow-id",
  "eventType": "lead.captured",
  "occurredAt": "2026-08-13T10:30:00Z",
  "source": "website",
  "correlationId": "request-id",
  "idempotencyKey": "sha256-of-source-and-event",
  "payload": {
    "name": "Prospect name",
    "email": "prospect@example.com",
    "phone": "redacted-in-logs",
    "listingReference": "EE-MLO-014",
    "zone": "Mlolongo",
    "requirement": "9,000 sq ft warehouse",
    "consent": true,
    "utm": {
      "source": "google",
      "medium": "organic",
      "campaign": "mlolongo-warehouse"
    }
  }
}
```

Event handlers must be safe to retry. A duplicate event must update or acknowledge the existing record, not create a second lead, contract, invoice, or payment.

### 14.5 Source-of-truth transition

Implement in this order:

1. Reconcile current Tina property records with Utility Property records manually.
2. Assign one stable listing reference to each approved unit.
3. Add `lastReviewedDate`, reviewer, and publication state to the operational record or an Eens-specific projection DocType.
4. Build a read-only projection endpoint.
5. Add a staging export into Tina and a human approval step.
6. Add automated rebuild and page verification.
7. Only then consider automated unpublishing when ERP state becomes reserved, occupied, or unpublished.

Do not start with direct, destructive CMS mutations.

---

## 15. Engineering backlog by vertical slice

### Slice 1 — approved inventory projection

- Add Eens-specific public publication fields.
- Implement read-only listing projection.
- Map Utility Property to Tina property by stable reference.
- Test field allowlist and unpublished behaviour.
- Verify category/detail pages and sitemap output.

### Slice 2 — lead capture

- Add validated public capture endpoint.
- Create/update CRM Lead with source and UTM fields.
- Add deduplication and idempotency.
- Add SLA, owner, and next-action assignment.
- Test malformed, duplicate, consent-denied, and rate-limited requests.

### Slice 3 — conversation routing

- Configure approved channel profiles and operating hours.
- Link inbound conversation to CRM Lead by identity and reference.
- Create template-driven acknowledgement and escalation.
- Store only necessary transcript/file links.
- Test webhook signatures, retries, opt-out, and channel failure.

### Slice 4 — contract and billing handoff

- Map qualified Deal to Utility Service Request.
- Configure unit selection, deposit, contract gates, and invoice gates.
- Test rent Auto Repeat and meter calculation with fixture data.
- Reconcile Sales Order, Sales Invoice, and Payment Entry.
- Test cancellation, amendment, overdue, and renewal paths.

### Slice 5 — marketing attribution

- Define event names and UTM persistence.
- Send qualified conversion events to the analytics destination.
- Join campaign source to CRM Lead and Deal.
- Build source-to-viewing and source-to-contract reports.
- Test consent and attribution expiry rules.

### Slice 6 — assistant skills and tools

- Add Eens-specific read-only tools through `assistant_tools`.
- Add skills through `assistant_skills` with source app ownership.
- Configure FAC Tool Configuration categories and role access.
- Add prompt templates with bounded arguments.
- Test permission denial, audit entries, tool timeout, and stale data warnings.

---

## 16. Observability and support

### Questions the team must be able to answer

1. Did the enquiry arrive, and where did it come from?
2. Was a CRM Lead created or updated, and who owns the next action?
3. Did the conversation, viewing, service request, contract, invoice, or payment event succeed?
4. Which dependency failed: website, n8n, channel provider, Frappe, or payment provider?
5. Did an assistant result use the right source record and permission scope?

### Required signals

- Structured events with `eventName`, `correlationId`, `source`, `status`, `durationMs`, and bounded error codes.
- RED metrics for each public endpoint and external dependency: rate, error rate, and p95/p99 duration.
- Queue age and failed execution counts for n8n and background jobs.
- Frappe Error Log and Assistant Audit Log retention with a review process.
- Alerts on user-facing symptoms: lead capture failure, webhook failure rate, invoice-generation failure, payment reconciliation exception, and critical public build failure.
- A short runbook for each alert with first query, owner, fallback, and escalation path.

Never log passwords, access tokens, payment credentials, full request bodies, or unredacted identity data.

---

## 17. Test and acceptance matrix

| Area | Minimum acceptance test |
|---|---|
| Public inventory | A non-approved unit cannot appear in a public route or sitemap |
| Listing freshness | A changed availability record is detected and routed for review |
| Lead capture | A valid enquiry creates one CRM Lead with source, consent, owner, SLA, and next action |
| Deduplication | Replaying the same event does not create a duplicate lead or message |
| Conversation | An inbound message is linked to the right profile and business record |
| Contract | Deposit and contract gates prevent invalid invoice creation |
| Meter billing | Previous/current readings produce the expected consumption and tariff amount |
| Finance | Invoice and payment references reconcile to the right customer and contract |
| Security | Unauthenticated, unauthorized, malformed, replayed, and oversized requests fail safely |
| AI read path | Assistant answers respect user permissions and identify the source report/record |
| AI write path | Any write action requires the intended role and explicit confirmation |
| SEO | Canonical, title, description, sitemap, headings, and visible property facts are correct |
| Performance | Public pages build statically and do not depend on live ERP or assistant calls |
| Recovery | A failed workflow can be retried or manually completed without data duplication |

---

## 18. Source basis

### Local system evidence

The proposal is based on the live Bench and checked source at the time of writing, including:

- `apps/utility_billing/utility_billing/hooks.py` and `utility_billing/docs/*.md`;
- Utility Billing DocTypes: `Utility Property`, `Utility Service Request`, `Contract Utility Property Item`, `Meter Reading`, `Utility Bill Structure`, `Billing Adjustment Rule`, and `Utility Billing Settings`;
- CRM DocTypes: `CRM Lead`, `CRM Deal`, `CRM Task`, `CRM Lead Source`, `CRM Lead Status`, `CRM Territory`, `CRM Organization`, `CRM Call Log`, and CRM settings;
- Assistant Core DocTypes: `Assistant Core Settings`, `Assistant Audit Log`, `FAC Skill`, `FAC Tool Configuration`, `FAC Plugin Configuration`, `Prompt Template`, and `Prompt Category`;
- communication DocTypes: chat profiles, messages, topics, templates, channel profiles, notification records, and integration settings;
- `apps/eens_app/eens_app/hooks.py`, which currently has no active Eens-specific DocTypes or business hooks;
- `apps/eens_app/frontend/src/content/property/*.mdx`, `tina/collections/property.ts`, `src/lib/data.ts`, `src/components/BaseHead.astro`, and `astro.config.mjs`.

### First-party technical references

- Frappe REST API: <https://docs.frappe.io/framework/user/en/api/rest>
- Frappe hooks: <https://docs.frappe.io/framework/user/en/python-api/hooks>
- Frappe users and permissions: <https://docs.frappe.io/framework/user/en/basics/users-and-permissions>
- Frappe DocTypes and controllers: <https://docs.frappe.io/framework/user/en/basics/doctypes/controllers>
- ERPNext documentation: <https://docs.erpnext.com/>
- ERPNext Sales Invoice: <https://docs.erpnext.com/docs/user/manual/en/sales-invoice>
- Astro configuration: <https://docs.astro.build/en/reference/configuration-reference/>
- Astro routing: <https://docs.astro.build/en/guides/routing/>
- Astro sitemap integration: <https://docs.astro.build/en/guides/integrations-guide/sitemap/>
- TinaCMS collections: <https://tina.io/docs/reference/collections>
- TinaCMS content API: <https://tina.io/docs/features/data-fetching>
- Google structured data: <https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data>
- Google sitemaps: <https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview>
- Google canonical URLs: <https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>
- Google structured-data policies: <https://developers.google.com/search/docs/appearance/structured-data/sd-policies>
- WhatsApp Business Platform documentation: <https://developers.facebook.com/docs/whatsapp/cloud-api/>

---

## Closing

Eens does not need a collection of disconnected digital activities. It needs a controlled path from demand to occupancy, from occupancy to billing, and from operational data back to better marketing decisions.

The recommended programme keeps the public site fast and factual, keeps Frappe/ERPNext authoritative for operational and financial records, uses CRM for commercial follow-through, uses the communication layer for responsive service, uses n8n for controlled orchestration, and uses the assistant layer to shorten analysis without bypassing permission or human accountability.

The result is a system that helps Eens publish with confidence, respond while demand is active, operate leases and utilities with less manual reconciliation, and invest in marketing based on the enquiries and revenue it actually produces.
