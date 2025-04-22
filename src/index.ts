import { Hono } from "hono";
import { handleMcpRequest } from "./handlers"; 
import { renderHomePage } from "./ui";

// Define environment interface
export interface Env {
  BITTENSOR_API_TOKEN: string;
  MCP_OBJECT: DurableObjectNamespace;
  [key: string]: any;
}

// Add the Durable Object class definition
export class BittensorMCP {
  private state: DurableObjectState;
  
  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
  }

  // Handle requests to the Durable Object
  async fetch(request: Request) {
    // Implement your Durable Object logic here
    return new Response("Durable Object working!");
  }
}

// Create Hono app
const app = new Hono<{ Bindings: Env }>();

// Home page
app.get("/", renderHomePage);

// Register the MCP endpoint
app.post("/v1/mcp", handleMcpRequest);

// Export the app as the default handler
export default app;