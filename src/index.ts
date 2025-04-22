import { Hono } from "hono";
import { handleMcpRequest } from "./handlers"; 
import { renderHomePage } from "./ui";

// Define environment interface
export interface Env {
  BITTENSOR_API_TOKEN: string;
  [key: string]: any;
}

// Create Hono app
const app = new Hono<{ Bindings: Env }>();

// Home page
app.get("/", renderHomePage);

// Register the MCP endpoint
app.post("/v1/mcp", handleMcpRequest);

// Export the app as the default handler
export default app;