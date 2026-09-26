// Sends anyone who isn't signed in to /login, remembering where they were
// going in ?next=. Add paths to PUBLIC to let people see them signed out.
// Pattern from the sandbox-auth README ("Gate pages").
import { NextRequest, NextResponse } from "next/server";
import { resolveConfig, readSession, revoked, sessionToken } from "sandbox-auth/core";

const PUBLIC = ["/login", "/api/auth"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // The cookie first: without one there's nothing to check. Before the app
  // has its client id nobody can be signed in, whatever cookie they carry
  // (on localhost, another Sandbox app's cookie is sent to every port).
  const token = sessionToken(request.cookies);
  let signedIn = false;
  if (token && process.env.SANDBOX_AUTH_CLIENT_ID) {
    const cfg = resolveConfig();
    const session = await readSession(cfg, token);
    signedIn = session !== null && !(await revoked(cfg, session));
  }

  // No session, or one from before a Sandbox sign-out → back to login.
  if (!signedIn) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
