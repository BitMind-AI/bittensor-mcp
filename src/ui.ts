import { Context } from 'hono'
import { BITTENSOR_ENDPOINTS, SERVER_CONFIG } from './constants'
import { Env } from './index'

/**
 * Render the home page HTML
 */
export function renderHomePage(c: Context<{ Bindings: Env }>) {
  const url = new URL(c.req.url)
  const baseUrl = `${url.protocol}//${url.host}`

  // Get available endpoints from the constants
  const endpointNames = Object.keys(BITTENSOR_ENDPOINTS).map((key) => {
    // Convert SNAKE_CASE to kebab-case
    return key.toLowerCase().replace(/_/g, '-')
  })

  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${SERVER_CONFIG.NAME}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: system-ui, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            line-height: 1.6;
            color: #333;
          }
          h1 { color: #2563eb; }
          h2 { margin-top: 1.5rem; }
          code { 
            background: #f1f5f9; 
            padding: 2px 4px; 
            border-radius: 4px;
            font-family: monospace;
          }
          pre { 
            background: #f1f5f9; 
            padding: 12px; 
            border-radius: 4px; 
            overflow-x: auto;
            font-family: monospace;
          }
          .endpoint {
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #e5e7eb;
          }
          footer {
            margin-top: 3rem;
            text-align: center;
            font-size: 0.875rem;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <h1>${SERVER_CONFIG.NAME}</h1>
        <p>This server provides access to Bittensor's intelligence oracles through the Machine Communication Protocol (MCP).</p>
        
        <h2>Available Endpoints</h2>
        <div class="endpoint">
          <h3>Image Detection</h3>
          <p>Analyze images using Bittensor's neural network.</p>
          <p><strong>Endpoint:</strong> <code>/v1/mcp</code></p>
          <p><strong>Function:</strong> <code>detect-image</code></p>
          <p><strong>Parameters:</strong></p>
          <pre>{
  "image": "https://example.com/image.jpg"
}</pre>
        </div>
        
        <div class="endpoint">
          <h3>Text Analysis</h3>
          <p>Analyze text content using Bittensor's language models.</p>
          <p><strong>Endpoint:</strong> <code>/v1/mcp</code></p>
          <p><strong>Function:</strong> <code>analyze-text</code></p>
          <p><strong>Parameters:</strong></p>
          <pre>{
  "text": "Your text to analyze"
}</pre>
        </div>
        
        <h2>Example Usage</h2>
        <h3>cURL</h3>
        <pre>curl -X POST "${baseUrl}/v1/mcp" \\
  -H "Content-Type: application/json" \\
  -d '{
    "request": {
      "function": "detect-image",
      "parameters": {
        "image": "https://picsum.photos/256"
      }
    }
  }'</pre>
        
        <h3>JavaScript</h3>
        <pre>fetch("${baseUrl}/v1/mcp", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    request: {
      function: "detect-image",
      parameters: {
        image: "https://picsum.photos/256"
      }
    }
  })
})
.then(response => response.json())
.then(data => console.log(data));</pre>

        <footer>
          ${SERVER_CONFIG.NAME} v${
    SERVER_CONFIG.VERSION
  } | &copy; ${new Date().getFullYear()}
        </footer>
      </body>
    </html>
  `)
}
