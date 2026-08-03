import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "src/lib/auth-store.ts",
        "src/lib/api-client.ts",
        "src/components/auth/ProtectedRoute.tsx",
        "src/components/dashboard/ApiKeyManager.tsx",
        "src/components/dashboard/PositionsTable.tsx",
        "src/components/dashboard/OrdersTable.tsx",
      ],
    },
  },
});
