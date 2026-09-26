import Script from "next/script";

// Only same-site paths. sandbox-auth v0.7.1 rejects "//host" but not "/\host",
// which browsers also read as another site.
function safeNext(next: string | undefined) {
  return next && /^\/(?![/\\])/.test(next) ? next : "/";
}

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  // The client id is public (it's in the page either way), so reading it
  // here is fine. The session secret must never leave the server.
  const clientId = process.env.SANDBOX_AUTH_CLIENT_ID;

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-2xl font-semibold">Sign in</h1>

        {error === "access_denied" && (
          <p className="text-sm text-red-600">
            You chose not to share your details, so you&apos;re not signed in.
          </p>
        )}
        {error && error !== "access_denied" && (
          <p className="text-sm text-red-600">Signing in didn&apos;t work. Try again.</p>
        )}

        {clientId ? (
          <>
            <div data-sandbox-signin data-client={clientId} data-next={safeNext(next)} />
            <Script src="https://auth.sandbox.is/button.js" strategy="afterInteractive" />
          </>
        ) : (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-left text-sm text-amber-900">
            <p className="font-medium">This app isn&apos;t linked to Sandbox yet.</p>
            <p className="mt-2">
              Link it on the{" "}
              <a className="underline" href="https://members.sandbox.is/vibes">
                Vibes page
              </a>
              . Once an admin approves it, set <code>SANDBOX_AUTH_CLIENT_ID</code> in your
              hosting settings and deploy again. The sign-in button will appear here.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
