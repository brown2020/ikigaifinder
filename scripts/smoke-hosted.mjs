import { checkProductionHealth } from "./hosted-health.mjs";

// Read-only: no tokens, provider calls, user records, or writes.
process.stdout.write(JSON.stringify(await checkProductionHealth()) + "\n");
