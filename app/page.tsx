import { redirect } from "next/navigation";
import { getSession } from "sandbox-auth/next";

export default async function Home() {
  // proxy.ts already sends signed-out people to /login; this is a backstop.
  const member = await getSession();
  if (!member) redirect("/login");

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        {member.picture ? (
          // A plain <img>: photo hosts vary, so next/image would need them configured.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.picture}
            alt=""
            className="mx-auto h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-neutral-200 text-3xl font-semibold text-neutral-600">
            {member.name?.[0] ?? "?"}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold">Hi, {member.name ?? "member"}</h1>
          {member.email && <p className="text-sm text-neutral-500">{member.email}</p>}
        </div>
        <p className="text-sm text-neutral-500">
          You&apos;re signed in with Sandbox. Now ask your agent to build your idea.
        </p>
        <form action="/api/auth/logout" method="post">
          <button className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
