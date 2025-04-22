# Bittensor MCP Server

A Machine Communication Protocol (MCP) server that provides integration with Bittensor's intelligence oracles, hosted on Cloudflare Workers.

## Features

- MCP-compliant API for Bittensor services
- Modular architecture for easy extension
- TypeScript for type safety
- Cloudflare Workers for global distribution and low latency

## Project Structure

```
bittensor-mcp-server/
├── src/
│   ├── index.ts                   # Main entry point
│   ├── constants.ts               # Configuration and constants
│   ├── ui.ts                      # UI rendering
│   ├── handlers/                  # API handlers
│   │   ├── index.ts               # Main request handler
│   │   ├── detect-image.ts        # Image detection handler
│   │   └── text-analysis.ts       # Text analysis example
│   └── utils/                     # Utility functions
│       ├── api.ts                 # API utilities
│       └── response.ts            # Response formatting
├── tsconfig.json                  # TypeScript configuration
├── wrangler.toml                  # Cloudflare configuration
├── package.json                   # Project dependencies
└── README.md                      # Documentation
```

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set your Bittensor API token**:
   Create a `.dev.vars` file in the project root:

   ```bash
   echo "BITTENSOR_API_TOKEN=your_token_here" > .dev.vars
   ```

3. **Build the TypeScript code**:

   ```bash
   npm run build
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

Your server will be running at http://localhost:8787.

## Available Endpoints

### Image Detection

Analyze images using Bittensor's neural networks.

**Function:** `detect-image`

**Parameters:**

```json
{
  "image": "https://example.com/image.jpg"
}
```

## Adding New Endpoints

To add a new endpoint (e.g., text analysis):

1. **Add the endpoint URL to constants.ts**:

   ```typescript
   export const BITTENSOR_ENDPOINTS = {
     DETECT_IMAGE: `${BITTENSOR_BASE_URL}/34/detect-image`,
     TEXT_ANALYSIS: `${BITTENSOR_BASE_URL}/15/analyze-text`,
   };
   ```

2. **Create a new handler file**:
   Create a file like `src/handlers/text-analysis.ts` (you can use the example file as a template).

3. **Register the handler in handlers/index.ts**:

   ```typescript
   // In the switch statement in handleMcpRequest function
   case 'analyze-text':
     return await textAnalysisHandler(c, parameters);
   ```

4. **Update UI documentation**:
   Add the new endpoint to the UI in `src/ui.ts`.

## Testing

### Test the image detection endpoint:

```bash
curl -X POST "http://localhost:8787/v1/mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "request": {
      "function": "detect-image",
      "parameters": {
        "image": "https://picsum.photos/256"
      }
    }
  }'
```

### Test the text analysis endpoint:

```bash
curl -X POST "http://localhost:8787/v1/mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "request": {
      "function": "analyze-text",
      "parameters": {
        "text": "This is a sample text to analyze. This is a sample text to analyze."
      }
    }
  }'
```

## Deployment

1. Set your API token as a secret:

   ```bash
   npx wrangler secret put BITTENSOR_API_TOKEN
   ```

2. Deploy to Cloudflare Workers:
   ```bash
   npm run deploy
   ```

## Best Practices

- Keep handlers modular and focused on a single responsibility
- Use the utility functions for API calls and response formatting
- Follow the established pattern for new endpoints
- Handle errors consistently with proper status codes and messages
- Document new endpoints in the UI and README
