// The two settings sign-in needs. Until both are set the app still runs,
// and the login page walks the person through setting it up.
export const SETTINGS = ["SANDBOX_AUTH_CLIENT_ID", "SANDBOX_AUTH_CLIENT_SESSION_SECRET"] as const;

export function missingSettings() {
  return SETTINGS.filter((name) => !process.env[name]);
}
