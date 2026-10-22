import { defineConfig } from "vitest/config";

// Runs against the Firestore and Storage emulators: `npm run test:rules`.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/rules/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 20_000,
  },
});
