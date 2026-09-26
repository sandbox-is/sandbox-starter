# Sandbox app starter

A tiny app where Sandbox members sign in with their Sandbox account. Your AI
agent copies it, you build your idea on top, and it goes online, ready for
other members to sign in and to work on with you.

## Start with your agent

Paste this into Claude Code or Cursor (change the name and the idea):

> Make me a new Sandbox app called **hub-dinners** by running
> `npx create-next-app@latest hub-dinners --example https://github.com/simonwisdom/sandbox-starter --use-npm --yes`,
> then read its AGENTS.md and run it so I can see it. I want to build: *an RSVP page for our hub's dinners*.

Then:

1. **Build your idea** by chatting with your agent. On your computer you're
   signed in as "Test Member", so you can try every page straight away.
2. **Put it online** when it's ready to show: ask your agent to *"put it online"*.
   It creates a public GitHub repo in the `sandbox-is` org (or your own account)
   and a Vercel project, and gives you the address.
3. **Link it** on the [Vibes page](https://members.sandbox.is/vibes): paste the
   address, add local port `3000`, say what it does, and click *Ask to link*.
4. **Once an admin approves it**, ask your agent to *"finish Sandbox setup"* and
   give it your app's ID.
5. **Sign in for real** with Sandbox. You should see your name and photo.

After that, every change your agent uploads to GitHub goes online by itself.

**Saving data** (RSVPs, lists, anything the app remembers) just works: there's
a database on your computer from the start, and putting it online adds a free
one for the live app. Your test data stays on your computer.

> Your app's ID isn't secret. The session secret is: never paste it into a chat.
> The setup script makes it for you, so nobody has to see it.

You'll need free [GitHub](https://github.com) and [Vercel](https://vercel.com)
accounts. Your agent will ask you to sign in to each once. The first time you
put an app online, you'll also accept Neon's terms (for the free database) on
[Vercel's website](https://vercel.com/marketplace/neon). Your agent will tell you when.

## Work on someone else's app

Ask your agent: *"Help me work on github.com/sandbox-is/hub-dinners."* It
downloads it and runs it with test sign-in, and sends your changes to the owner
as a pull request for them to accept.

## Prefer clicking?

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsimonwisdom%2Fsandbox-starter&project-name=my-sandbox-app&repository-name=my-sandbox-app)

This copies the template to your GitHub and puts it online in one go (you can
pick the `sandbox-is` org as the owner if you're in it). Then open your copy
with your agent and carry on from step 1 above.

## If something's wrong

| what you see | what to do |
|---|---|
| "Almost there" instead of a sign-in button | Setup isn't finished. Follow the steps on that page. |
| "You're not in the sandbox-is GitHub org" | Ask to be added, or put it under your own account for now. |
| Changes pushed but not online | Vercel's free plan only deploys changes made by the project's owner, from the email linked to their GitHub account. |
| Settings added but nothing changed | Vercel only picks up new settings after a redeploy. |
| Sign-in fails on a draft or preview address | Sign-in only works at the address you linked, not on Vercel's preview links. |
| No sign-in button | The ID is mistyped, or the app isn't approved yet. |
| Sandbox says the return address isn't allowed | You're on a different address from the one you linked. A new address means linking again. |
| Signed in, but sent back to the login page | The session secret changed. Sign in again. |

More in the [sandbox-auth troubleshooting guide](https://github.com/cesarsalazar/sandbox-auth/tree/v0.7.1#troubleshooting).

## What's inside

- **Next.js** (App Router) with **Tailwind**, ready for Vercel
- **[sandbox-auth](https://github.com/cesarsalazar/sandbox-auth)** for Sign in with Sandbox
- Sign-in page, a signed-in home page and sign-out; every other page needs sign-in
- A Postgres database (local on your computer, [Neon](https://neon.tech) online), a
  `members` table filled in as people sign in, and admins
- `AGENTS.md`: instructions and rules for your AI agent
