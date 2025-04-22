# Bittensor MCP Server

A simple Machine Communication Protocol (MCP) server that integrates with Bittensor's intelligence oracles.

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

## Deployment

1. Set your API token as a secret:

   ```bash
   npx wrangler secret put BITTENSOR_API_TOKEN
   ```

2. Deploy to Cloudflare Workers:
   ```bash
   npm run deploy
   ```
