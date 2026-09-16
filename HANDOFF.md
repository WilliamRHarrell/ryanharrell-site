# ryanharrell.com Handoff

Last updated: 2026-09-15

## Project Location

Repo path:

```text
/Users/williamharrell/Desktop/ryanharrell-site
```

GitHub remote:

```text
git@github.com:WilliamRHarrell/ryanharrell-site.git
```

Current branch:

```text
main
```

Latest known pushed commit:

```text
c9f950d add consultation appointment request form + /api/appointment endpoint
```

## App Overview

Static single-page site deployed on Vercel (`vercel.json` sets `outputDirectory: public`). Pushing to `main` deploys straight to production at ryanharrell.com.

Important files:

```text
public/index.html    – the entire site (markup, CSS, and JS in one file)
api/contact.js       – contact form endpoint (Resend email)
api/appointment.js   – consultation appointment request endpoint (Resend email)
```

Email is sent via Resend using the `RESEND_API_KEY` env var configured in Vercel. Both endpoints send to ryan@ryanharrell.com with reply-to set to the submitter.

## Current State (2026-09-15)

The Consulting & Advisory section (`#consulting`) now ends with an appointment request form (`#appointment`):

- Fields: name, email, phone (optional), company (optional), consulting area dropdown (matches the six consult cards + "Not Sure Yet"), preferred date (past dates blocked), preferred time window (ET), details textarea.
- Submits JSON to `/api/appointment`, which emails Ryan the request. Ryan confirms times manually by replying — there is no calendar integration yet.
- The hero "Book Ryan" button and the consulting CTA "Request a Consultation" button both jump to `#appointment`.
- Live and verified pushed; test submission recommended if not yet done.

## Next Task: Cal.com Automatic Scheduling

Ryan wants to replace the email-and-confirm flow with real self-service booking via Cal.com (decided 2026-09-15, planned for the week of 2026-09-15).

Plan:

1. Ryan creates a Cal.com account, connects his calendar, and sets up an event type (e.g. "Consultation" with his availability windows).
2. Embed Cal.com in the `#appointment` block of `public/index.html` — either the inline embed or the popup triggered from the existing "Request a Consultation" / "Book Ryan" buttons. Cal.com's embed snippet is a small script tag; style the container to match the site's dark navy/gold theme (Cal.com supports a dark theme option in embed config).
3. Decide what to do with the existing form and `/api/appointment`: keep as a fallback below the embed, or remove them once the embed is confirmed working. Consulting-area/context questions can be recreated as custom booking questions on the Cal.com event type so nothing is lost.
4. Push to `main` to deploy; verify a real booking lands on the calendar and confirmation emails go out.

Prerequisite from Ryan: the Cal.com username / event-type link (e.g. `cal.com/ryanharrell/consultation`) once the account is set up.
