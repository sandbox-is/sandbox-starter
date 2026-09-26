# Sandbox app starter

A tiny app where Sandbox members sign in with their Sandbox account. Copy it,
put it online, then ask your AI agent (Claude, Cursor…) to build your idea on top.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsimonwisdom%2Fsandbox-starter&project-name=my-sandbox-app&repository-name=my-sandbox-app)

## Get it working

1. **Click Deploy with Vercel** above. Sign in to GitHub and Vercel when asked.
   You get your own copy of the code, online in about 2 minutes. Nobody can
   sign in yet, so it's fine for it to be unfinished.
2. **Build your idea.** Open your copy with your AI agent and ask it to run the
   app on your computer. You're signed in as a pretend "Test Member", so you can
   build and try every page. Each change your agent pushes to GitHub goes online by itself.
3. **Link it** on the [Vibes page](https://members.sandbox.is/vibes) when it's
   ready to show. Your app shows you its address and what to fill in.
4. **Once an admin approves it**, ask your agent to *"finish Sandbox setup"*
   and give it your app's ID. It adds the settings and redeploys.
   (Or do it by hand: your app shows you how.)
5. **Sign in for real** with Sandbox. You should see your name and photo.

> Your app's ID isn't secret. The session secret is: never paste it into a chat.
> The setup script makes it for you, so nobody has to see it.

## Working on your computer

```bash
git clone <your repo>
cd <your repo>
npm install
npm run dev     # open http://localhost:3000
```

Until your app is set up, you're signed in as a pretend "Test Member" there.
After `npm run setup`, real Sandbox sign-in works on your computer too, as long
as you gave port `3000` when you linked the app.

## If something's wrong

| what you see | what to do |
|---|---|
| "Almost there" instead of a sign-in button | Setup isn't finished. Follow the steps on that page. |
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
- `AGENTS.md`: instructions and rules for your AI agent
