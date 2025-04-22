import { Hono } from "hono";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define environment interface
interface Env {
  BITTENSOR_API_TOKEN: string;
  [key: string]: any;
}

// Bittensor API base URL and endpoint
const BITTENSOR_BASE_URL = "https://api.bitmind.ai/oracle/v1";
const IMAGE_DETECTION_ENDPOINT = `${BITTENSOR_BASE_URL}/34/detect-image`;

// Create Hono app
const app = new Hono<{ Bindings: Env }>();

// Home page
app.get("/", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Bittensor MCP Server</title>
        <meta charset="utf-8">
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2563eb; }
          code { background: #f1f5f9; padding: 2px 4px; border-radius: 4px; }
          pre { background: #f1f5f9; padding: 12px; border-radius: 4px; overflow-x: auto; }
        </style>
      </head>
      <body>
        <h1>Bittensor MCP Server</h1>
        <p>This server provides access to Bittensor's intelligence oracles through MCP.</p>
        <h2>Available Endpoints</h2>
        <ul>
          <li><strong>Image Detection</strong> - <code>/v1/mcp</code> with function <code>detect-image</code></li>
        </ul>
        <h2>Example Request</h2>
        <pre>curl -X POST "${c.req.url}v1/mcp" \\
  -H "Content-Type: application/json" \\
  -d '{
    "request": {
      "function": "detect-image",
      "parameters": {
        "image": "https://picsum.photos/256"
      }
    }
  }'</pre>
      </body>
    </html>
  `);
});

// Helper function to call Bittensor API
async function callBittensorAPI(url: string, body: any, token: string) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Bittensor API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

// MCP server setup
const server = new McpServer({
  name: "Bittensor Oracle MCP",
  version: "1.0.0",
});

// Register image detection handler
server.tool("detect-image", 
  {
    image: z.string().url()
  },
  async (args, extra) => {
    try {
      const { image } = args;
      // Access the token directly from the global context
      // This is a workaround since we can't easily access env through extra
      const apiToken = (globalThis as any).BITTENSOR_API_TOKEN;
      
      if (!apiToken) {
        throw new Error("API token not configured");
      }

      const result = await callBittensorAPI(
        IMAGE_DETECTION_ENDPOINT,
        { image },
        apiToken
      );

      return {
        content: [
          {
            type: "text",
            text: "Image detection results:"
          },
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${errorMessage}`
          }
        ],
        isError: true
      };
    }
  }
);

// Register the MCP endpoint
app.post("/v1/mcp", async (c) => {
  try {
    const body = await c.req.json();
    const { function: funcName, parameters } = body.request;
    
    if (funcName === 'detect-image') {
      const { image } = parameters;
      const apiToken = c.env.BITTENSOR_API_TOKEN;
      console.log(apiToken);
      const response = await fetch(IMAGE_DETECTION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image })
      });
      
      if (!response.ok) {
        throw new Error(`Bittensor API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      return new Response(JSON.stringify({
        content: [
          {
            type: "text",
            text: "Image detection results:"
          },
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return c.json({ error: "Unsupported function" }, 400);
  } catch (error) {
    console.error("MCP processing error:", error);
    return c.json(
      { 
        error: "MCP processing error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }, 
      500
    );
  }
});

// Export the app as the default handler
export default app;