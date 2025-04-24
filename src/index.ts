import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGeneratedRoutes } from "./generated/routes.js";

// Get configuration from environment variables
export const API_BASE_URL =
  process.env.BITMIND_API_BASE_URL || "https://api.bitmind.ai/oracle/v1";
const API_TOKEN = process.env.BITMIND_API_TOKEN;

// Validate required configuration
if (!API_TOKEN) {
  console.error("Error: BITMIND_API_TOKEN environment variable is required");
  process.exit(1);
}

// Create server instance
const server = new McpServer({
  name: "bittensor",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register generated routes
registerGeneratedRoutes(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Bittensor MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
