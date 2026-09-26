# Sandbox app starter

A small Next.js app where Sandbox members sign in with their Sandbox account.
It's a starting point: the person you're helping will ask you to build their
idea on top of it. They may not be an engineer, so explain in plain words.

The usual order: they deploy it, build their idea on their own computer with
test sign-in, link it on the Vibes page once it's ready to show, and after
approval ask you to finish setup (see below).

## Rules

- **Never ask for, print or paste secret values.** Not in the chat, not in code,
  not in commits. Refer to settings by name only. If a value is needed, tell the
  person where to put it (`.env.local` on their computer, or Vercel → Settings →
  Environment Variables) and let them do it.
- **Secrets stay on the server.** Never read `SANDBOX_AUTH_CLIENT_SESSION_SECRET`
  or `SANDBOX_MEMBERS_TOKEN` in a client component (`"use client"`), and never
  prefix them with `NEXT_PUBLIC_`. `SANDBOX_AUTH_CLIENT_ID` is not secret.
- **Keep the callback at `/api/auth/callback`.** Sandbox only sends people back
  to that exact path. Don't move or rename it.
- **Don't commit `.env.local`.** It's git-ignored; keep it that way.
  `.env.example` lists the names with no values.

## Settings

| name | what it is |
|---|---|
| `SANDBOX_AUTH_CLIENT_ID` | the app's ID, shown on the Vibes page once an admin approves the app |
| `SANDBOX_AUTH_CLIENT_SESSION_SECRET` | a long random string that signs the session cookie |

Until both are set, the app still builds and runs, and the login page shows a
setup guide instead of the sign-in button. If the person is stuck, point them
to that page: it tells them what's missing and what to do.

### Finishing setup

When the person says their app is approved (or asks you to finish setup), ask
for their app ID from the Vibes page. It isn't secret: it appears in every
sign-in page. Then run:

```bash
npm run setup -- <app ID>
```

It saves the ID in Vercel, makes the session secret and saves it without
showing it to anyone (you included), fills in `.env.local`, and redeploys.
Never generate, print or ask for the secret yourself; the script handles it.

- If it says they're not signed in to Vercel, ask them to run `npx vercel login`
  themselves (in Claude Code: type `! npx vercel login`). It opens a browser.
- If it can't find the project, ask for the project name shown in Vercel and
  run `npm run setup -- <app ID> --project <name>`.

Sign-in only works at the address the app was linked with (and localhost, if
they gave a port). Vercel preview links won't work, and a new address means
linking again on https://members.sandbox.is/vibes.

## How sign-in works

It uses [sandbox-auth](https://github.com/cesarsalazar/sandbox-auth/tree/v0.7.1#readme)
(pinned to v0.7.1 in `package.json`). Read that README before changing anything
about sign-in.

| file | job |
|---|---|
| `app/login/page.tsx` | the Sign in with Sandbox button, and sign-in error messages |
| `app/login/setup-guide.tsx` | what the login page shows until both settings are set |
| `lib/setup.ts` | which settings are missing, and whether test sign-in is on |
| `lib/session.ts` | `getMember()`: the signed-in member (real, or the test member) |
| `scripts/setup.mjs` | `npm run setup`: saves both settings in Vercel and redeploys |
| `app/api/auth/callback/route.ts` | where Sandbox sends people back; sets the session cookie |
| `app/api/auth/logout/route.ts` | signs out of this app |
| `proxy.ts` | sends signed-out people to `/login`; edit `PUBLIC` to open pages to everyone |
| `app/page.tsx` | the signed-in home page: the member's name and photo |

To get the signed-in member in a server component, route handler or server action:

```ts
import { getMember } from "@/lib/session";

const member = await getMember();
// { sub, name, email, picture?, phone_number?, member_data?, iat } | null
```

Always use `getMember`, not sandbox-auth's `getSession`: it's the same, but it
also works with test sign-in.

### Test sign-in

Under `npm run dev`, until both settings are set, everyone is signed in as a
test member ("Test Member", `lib/session.ts`) and a banner says so. That lets
the person build and try every page before their app is approved. It never
turns on in a production build (`next build`/`next start`, which is what Vercel
runs), and it switches off by itself once `npm run setup` has filled in
`.env.local`. Don't remove the `NODE_ENV` check in `lib/setup.ts`.

- `member.sub` is their permanent Sandbox ID. Use it as the key when you store
  anything about a member.
- Sandbox says **who** someone is, not **what they may do**. Keep roles and
  permissions in the app's own database, looked up by `member.sub`.
- Extra profile fields (`preferred_name`, `current_city`, `current_hub`,
  `entry_hub`, `member_since`, `date_of_birth`) arrive in `member.member_data`
  only if the app asked for them when it was linked **and** the member agreed.
  Always treat them as possibly missing.

## Commands

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
npm run setup -- <app ID>   # after approval: saves settings in Vercel and redeploys
```

Signing in on localhost only works if the app was linked with local port 3000
on the Vibes page.

## The Vibes prompts

These are the prompts from https://members.sandbox.is/vibes, kept here so you
always have them.

### Sign in with Sandbox (used by this app)

> Add Sign in with Sandbox to this app. Follow the sandbox-auth README:
> https://github.com/cesarsalazar/sandbox-auth/tree/v0.7.1#readme
>
> The app's ID from Sandbox goes in SANDBOX_AUTH_CLIENT_ID. If it isn't set, build the rest and tell me to get one from the Vibes page at https://members.sandbox.is/vibes.

### Member data (not used by this app; needs separate admin approval)

Only for apps that must look up *other* members by email or phone. Most apps
don't need it. If the person wants it, they request access on the Vibes page
first, then add `SANDBOX_MEMBERS_TOKEN`. Call it only from server code.

> You can call the Sandbox Members API.
>
> Base URL: https://members.sandbox.is
> OpenAPI:  https://members.sandbox.is/api/v1/openapi.json
>
> Fetch the OpenAPI document first — it is public, and it lists every operation,
> parameter, and error code. Treat it as the source of truth over anything you
> recall about this API.
>
> Authenticate with the token in the SANDBOX_MEMBERS_TOKEN environment variable:
>   Authorization: Bearer $SANDBOX_MEMBERS_TOKEN
>
> Read it from the environment at call time. If it is not set, say so and stop:
> tokens come from the Vibes page in the members app, and one should be put in
> your environment rather than into this conversation.
>
> On failure, branch on the error's "code"; the "message" is prose and may be
> reworded. A 401 with "invalid_token" usually means the token was rotated or
> revoked — tokens here are replaced in place, with no overlap period. Unknown
> and revoked tokens are reported identically, so you cannot tell them apart.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
