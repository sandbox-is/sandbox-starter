# Sandbox app starter

A tiny app where Sandbox members sign in with their Sandbox account. Copy it,
put it online, then ask your AI agent (Claude, Cursor…) to build your idea on top.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsandbox-is%2Fsandbox-starter&project-name=my-sandbox-app&repository-name=my-sandbox-app&env=SANDBOX_AUTH_CLIENT_SESSION_SECRET&envDescription=A+long+random+string+that+signs+your+session+cookie.+Use+%22Make+one+for+me%22+on+the+Vibes+page.&envLink=https%3A%2F%2Fmembers.sandbox.is%2Fvibes)

## Get it working (about 15 minutes, plus waiting for approval)

1. **Get a session secret.** On the [Vibes page](https://members.sandbox.is/vibes),
   under *Sign in with Sandbox → Add two settings*, click **Make one for me** and copy it.
2. **Click Deploy with Vercel** above. Sign in to GitHub and Vercel when asked,
   and paste the secret into `SANDBOX_AUTH_CLIENT_SESSION_SECRET`.
   This makes your own copy of the code and puts it online.
3. **Copy your address**, like `https://my-sandbox-app.vercel.app`.
   It's shown when the deploy finishes.
4. **Link your app** on the [Vibes page](https://members.sandbox.is/vibes).
   Give it a name, paste the address (nothing after `.app`), and put `3000`
   as the local port. Click **Ask to link**.
5. **Wait for an admin to approve it.** The Vibes page then shows your app's ID.
6. **Add the ID.** In Vercel, open your project → **Settings → Environment Variables**,
   add `SANDBOX_AUTH_CLIENT_ID` with your app's ID, then **Deployments → Redeploy**.
7. **Sign in.** Open your address and click the Sign in with Sandbox button.
   You should see your name and photo.

Now open your copy of the code with your agent and **ask it to build your idea.**
It will find its instructions in `AGENTS.md`.

> Never paste your secret or app ID into a chat with your agent. Tell it the
> setting names instead; it knows where they go.

## Working on your computer

```bash
git clone <your repo>
cd <your repo>
npm install
cp .env.example .env.local   # then fill in the two values in .env.local
npm run dev                  # open http://localhost:3000
```

Sign-in on your computer works only if you gave port `3000` when you linked the app.

## If something's wrong

| what you see | what to do |
|---|---|
| "This app isn't linked to Sandbox yet" | Do steps 4–6. After adding the ID, redeploy. |
| No sign-in button | The ID is mistyped, or the app isn't approved yet. |
| Sandbox says the return address isn't allowed | You're on a different address from the one you linked. A new address means linking again. |
| Signed in, but sent back to the login page | The session secret changed. Sign in again. |

More in the [sandbox-auth troubleshooting guide](https://github.com/cesarsalazar/sandbox-auth/tree/v0.7.1#troubleshooting).

## What's inside

- **Next.js** (App Router) with **Tailwind**, ready for Vercel
- **[sandbox-auth](https://github.com/cesarsalazar/sandbox-auth)** for Sign in with Sandbox
- Sign-in page, a signed-in home page and sign-out; every other page needs sign-in
- `AGENTS.md`: instructions and rules for your AI agent
