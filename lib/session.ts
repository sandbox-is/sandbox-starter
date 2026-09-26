import { getSession } from "sandbox-auth/next";
import { pretendSignIn } from "./setup";

export type Member = NonNullable<Awaited<ReturnType<typeof getSession>>>;

export const PRETEND_MEMBER: Member = {
  sub: "00000000-0000-0000-0000-000000000000",
  name: "Test Member",
  email: "test.member@example.com",
};

// The signed-in member, or null. Use this rather than sandbox-auth's
// getSession so pages also work with pretend sign-in.
export async function getMember(): Promise<Member | null> {
  if (pretendSignIn()) return PRETEND_MEMBER;
  return getSession();
}
