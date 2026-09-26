// Finishes Sign in with Sandbox setup once the app is approved:
//
//   npm run setup -- <app ID from the Vibes page> [--project <vercel project>]
//
// It saves the app ID in Vercel, makes a session secret and saves it without
// ever printing it, fills in .env.local for local use, and redeploys.
// Needs the Vercel CLI to be signed in (npx vercel login).
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const ID = "SANDBOX_AUTH_CLIENT_ID";
const SECRET = "SANDBOX_AUTH_CLIENT_SESSION_SECRET";

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

// Runs the Vercel CLI. Values go in through stdin so they never appear in a
// process list or in this script's output.
function vercel(args, input) {
  const result = spawnSync("npx", ["--yes", "vercel@60", ...args, "--non-interactive"], {
    encoding: "utf8",
    input,
  });
  return { ok: result.status === 0, out: result.stdout ?? "", err: result.stderr ?? "" };
}

function parseJson(text, what) {
  const start = text.indexOf("{");
  try {
    return JSON.parse(text.slice(start));
  } catch {
    fail(`Couldn't read the list of ${what} from Vercel.`);
  }
}

// The Deploy button names the Vercel project after the GitHub repo, so the
// repo name is the best guess unless this folder is already linked.
function guessProject() {
  if (existsSync(".vercel/project.json")) {
    const linked = JSON.parse(readFileSync(".vercel/project.json", "utf8"));
    if (linked.projectName) return linked.projectName;
  }
  const remote = spawnSync("git", ["remote", "get-url", "origin"], { encoding: "utf8" });
  return remote.stdout.trim().match(/([^/:]+?)(\.git)?$/)?.[1];
}

// Sets NAME=value in .env.local, keeping every other line as it was.
function setLocal(lines, name, value) {
  const i = lines.findIndex((l) => l.startsWith(`${name}=`));
  if (i >= 0) lines[i] = `${name}=${value}`;
  else lines.push(`${name}=${value}`);
}

const args = process.argv.slice(2);
let project;
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--project") project = args[++i];
  else positional.push(args[i]);
}
project ??= guessProject();
const [clientId] = positional;

if (!clientId || /\s/.test(clientId)) {
  fail("Give your app ID from https://members.sandbox.is/vibes:  npm run setup -- <app ID>");
}
if (!project) fail("Couldn't tell which Vercel project this is. Add --project <name>.");

console.log("Checking you're signed in to Vercel…");
if (!vercel(["whoami"]).ok) {
  fail("You're not signed in to Vercel. Run  npx vercel login  and try again.");
}

console.log(`Looking at the Vercel project "${project}"…`);
const envList = vercel(["env", "ls", "production", "--project", project, "--json"]);
if (!envList.ok) {
  fail(`Couldn't find the Vercel project "${project}". Add --project <name> with the name shown in Vercel.`);
}
const existing = new Set(parseJson(envList.out, "settings").envs.map((e) => e.key));

console.log(`Saving ${ID}…`);
const idSaved = vercel(
  ["env", "add", ID, "production", "--project", project, "--no-sensitive", "--force", "--yes"],
  clientId,
);
if (!idSaved.ok) fail(`Couldn't save ${ID} in Vercel.\n${idSaved.err.trim()}`);

if (existing.has(SECRET)) {
  // Changing it would sign everyone out, so an existing one stays.
  console.log(`${SECRET} is already set. Keeping it.`);
} else {
  console.log(`Making ${SECRET} and saving it (it's never shown)…`);
  const secretSaved = vercel(
    ["env", "add", SECRET, "production", "--project", project, "--sensitive", "--yes"],
    randomBytes(32).toString("base64url"),
  );
  if (!secretSaved.ok) fail(`Couldn't save ${SECRET} in Vercel.\n${secretSaved.err.trim()}`);
}

// Local development gets its own secret: sessions on localhost and on the
// live site are separate anyway.
const lines = existsSync(".env.local") ? readFileSync(".env.local", "utf8").split("\n") : [];
setLocal(lines, ID, clientId);
if (!lines.some((l) => l.startsWith(`${SECRET}=`) && l.length > SECRET.length + 1)) {
  setLocal(lines, SECRET, randomBytes(32).toString("base64url"));
}
writeFileSync(".env.local", lines.join("\n").trimEnd() + "\n");
console.log("Filled in .env.local for running on your computer.");

console.log("Redeploying so the new settings take effect (about a minute)…");
const list = vercel(["ls", project, "--environment", "production", "--json", "--limit", "1"]);
const latest = list.ok ? parseJson(list.out, "deployments").deployments[0] : undefined;
if (!latest) fail("Couldn't find your live deployment. In Vercel, open Deployments and click Redeploy.");
const redeploy = vercel(["redeploy", latest.url, "--target", "production"]);
if (!redeploy.ok) {
  fail(`The redeploy didn't work. In Vercel, open Deployments and click Redeploy.\n${redeploy.err.trim()}`);
}

console.log("\n✓ Done. Open your app's address and sign in with Sandbox.\n");
