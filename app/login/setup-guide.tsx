import Link from "next/link";
import { headers } from "next/headers";
import { SETTINGS, testSignIn } from "@/lib/setup";
import { CopyButton } from "./copy-button";

const VIBES = "https://members.sandbox.is/vibes";

// Shown on the login page until both settings are set, so someone who just
// clicked "Deploy" can finish setting up without reading anything else.
export async function SetupGuide({ missing }: { missing: string[] }) {
  const host = (await headers()).get("host") ?? "";
  const local = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  // On Vercel, link the project's main address, not this deployment's own one.
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const address = `https://${production ?? host}`;
  const port = host.split(":")[1] ?? "3000";

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-semibold">Almost there</h1>
        <p className="mt-1 text-neutral-500">
          {local
            ? "Link your app to Sandbox so members can sign in."
            : "Your app is online. Link it to Sandbox so members can sign in."}
        </p>
      </div>

      {testSignIn() && (
        <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
          While you build, you&apos;re signed in as a test member.{" "}
          <Link className="underline" href="/">
            Back to your app
          </Link>
          . Link it when it&apos;s ready to show.
        </div>
      )}

      <ol className="space-y-5">
        <li>
          <p className="font-medium">1. Link your app</p>
          {local ? (
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              On the Vibes page, give your app&apos;s Vercel address and put{" "}
              <code>{port}</code> as the local port.
            </p>
          ) : (
            <>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Copy your app&apos;s address. On the Vibes page, paste it into{" "}
                <em>Where it lives</em>, give your app a name, and click <em>Ask to link</em>.
              </p>
              <div className="mt-2 flex items-center gap-2 rounded-md bg-neutral-100 p-2 dark:bg-neutral-900">
                <code className="flex-1 truncate text-sm">{address}</code>
                <CopyButton text={address} />
              </div>
            </>
          )}
          <a
            href={VIBES}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
          >
            Open the Vibes page
          </a>
        </li>

        <li>
          <p className="font-medium">2. Wait for an admin to approve it</p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            The Vibes page then shows your app&apos;s ID.
          </p>
        </li>

        <li>
          <p className="font-medium">3. Add two settings</p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Easiest: ask your AI agent to <em>&ldquo;finish Sandbox setup&rdquo;</em> and give it
            your app&apos;s ID. It adds both settings and redeploys for you.
          </p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Or do it yourself.{" "}
            {local ? (
              <>Put them in <code>.env.local</code>, then restart <code>npm run dev</code>.</>
            ) : (
              <>
                In Vercel, open your project, go to <em>Settings → Environment Variables</em>{" "}
                and add them. Then go to <em>Deployments</em> and click <em>Redeploy</em>.
              </>
            )}
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {SETTINGS.map((name) => (
              <li key={name}>
                {missing.includes(name) ? "○" : "✓"} <code>{name}</code>
                <span className="text-neutral-500">
                  {name === "SANDBOX_AUTH_CLIENT_ID"
                    ? " — your app's ID"
                    : " — click “Make one for me” on the Vibes page"}
                </span>
              </li>
            ))}
          </ul>
        </li>
      </ol>

      <p className="text-xs text-neutral-500">
        Your app&apos;s ID isn&apos;t secret, so it&apos;s fine to give it to your agent. Never
        paste the session secret into a chat.
      </p>
    </div>
  );
}
