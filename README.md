# ASME Placeholder / Production Site

⚠️ **Internal repository — not for public use**

This repository contains the source code for the **ASME Consultoría website**, deployed via **Vercel**.  
It exists primarily to support **continuous deployment**, environment configuration, and collaboration.

---

## Purpose

- Host the production codebase for the ASME site
- Enable automated deployments through **Vercel**
- Serve as a controlled source of truth for the live application

This repository is **not intended** to be reused, forked, or distributed publicly.

---

## Deployment

The site is deployed using **Vercel**.

- **Main branch:** `main`
- **Deployment trigger:** Pushes to `main`
- **Environment variables:** Managed in Vercel (not committed to this repo)

No manual deployment steps are required once Vercel is connected.

---

## Tech Stack

> Adjust if needed — this is the assumed stack based on usage.

- **Framework:** Next.js
- **Runtime:** Node.js
- **Hosting:** Vercel
- **Database / Auth (if applicable):** Supabase
- **Styling:** Tailwind CSS
- **Version Control:** GitHub (private)

---

## Environment Variables

All sensitive configuration is handled via **Vercel Environment Variables**.

Examples (do **not** commit these):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Any API keys or secrets

---

## Local Development (Optional)

If local development is required:

```bash
npm install
npm run dev
