✅ Work Breakdown Structure (WBS) + To-Do List
PHASE 1: Core Infrastructure & Auth
 Setup project repo structure: MVC, EJS, Bootstrap, Sequelize

 Configure .env, Sequelize, and MySQL with UUID support

 Implement user registration (username/password + email verification)

 Add OAuth (Google, Apple, Microsoft) with refresh handling

 Add 2FA (TOTP with speakeasy)

 Setup login attempt tracking and blocking (with admin override)

PHASE 2: Basic UI Pages & Localization
 Create Landing Page with i18n content and custom color scheme

 Build Terms of Trade, Privacy Policy, Contact Us (reCAPTCHA + email)

 Setup i18n (i18n package) and language switcher

 Add multi-language support for all static/dynamic EJS views

PHASE 3: Dashboard & File/URL Handling
 Design dashboard (EJS cards/tables) showing social accounts & content

 Create file upload system (limit file types/sizes)

 Create URL submission with metadata extraction

 Store metadata/transcription/sentiment/tags

 Implement AI analysis pipeline (Google Vision, Speech-to-Text, OpenAI)

PHASE 4: Contacts & Relationships
 Implement Apple-like Contacts schema (phones, emails, notes, etc.)

 Support CRUD for contacts and vCard import/export

 Add contact relationships table (with graph view using vis.js)

 Grouping for contacts and share logs

PHASE 5: Admin Panel
 Admin UI to manage users, locks, settings

 File upload settings (types, sizes)

 Login blocking thresholds + auto-unlock

 IP whitelisting/blacklisting

 View login logs, subscription logs

PHASE 6: Social Media Integration
 OAuth linking for 11 social platforms

 Secure storage of tokens (encrypted with crypto)

 Polling or webhook ingestion of messages/content

 Ignore irrelevant inbound messages

PHASE 7: Sharing, Search, Grouping
 Group management for URLs/files (hierarchical)

 Share content with contacts/groups via email or in-app

 Add filter/search by tag, platform, date, full-text

PHASE 8: Final Setup & DevOps
 Dockerize app + setup app.yaml for Google App Engine

 Setup Cloud SQL instance (with db-f1-micro)

 Integrate Stripe for subscription payments

 Add SendGrid, Twilio, Sentry, Helmet, CSRF protection

 Setup Redis for caching

 CI/CD via GitHub Actions

 Deploy to daysave.app with HTTPS + auto-backup

Testing & QA
 Unit tests with Jest

 E2E tests with Cypress

 Test dev-mode login with mock users

 Accessibility and SEO testing

