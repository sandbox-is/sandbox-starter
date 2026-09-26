import { getSession } from "sandbox-auth/next";
import { testSignIn } from "./setup";

export type Member = NonNullable<Awaited<ReturnType<typeof getSession>>>;

export const TEST_MEMBER: Member = {
  sub: "00000000-0000-0000-0000-000000000000",
  name: "Test Member",
  email: "test.member@example.com",
};

// The signed-in member, or null. Use this rather than sandbox-auth's
// getSession so pages also work with test sign-in.
export async function getMember(): Promise<Member | null> {
  if (testSignIn()) return TEST_MEMBER;
  return getSession();
}
