# Bittensor MCP Server

A Cloudflare Worker that provides access to Bittensor's intelligence oracles through the Model Context Protocol (MCP).

## Overview

This server acts as a bridge between MCP-compatible clients (like Claude, GPT-4, etc.) and Bittensor's neural networks. It allows AI assistants to access Bittensor's capabilities through a standardized interface.

## Features

- **Image Detection**: Analyze images using Bittensor's neural network
- **Text Analysis**: Process and analyze text using Bittensor's language models
- **OAuth Authentication**: Secure access to the MCP server
- **SSE Support**: Compatible with MCP Inspector for testing and debugging

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (Cloudflare Workers CLI)
- A Cloudflare account
- A Bittensor API token

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bittensor-mcp-server.git
   cd bittensor-mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.dev.vars` file for local development (copy from example):
   ```bash
   cp .dev.vars.example .dev.vars
   ```

4. Edit the `.dev.vars` file and add your Bittensor API token:
   ```
   BITTENSOR_API_TOKEN=your_api_token_here
   ```

5. Create a KV namespace for OAuth:
   ```bash
   wrangler kv:namespace create OAUTH_KV
   ```

6. Update the `wrangler.jsonc` file with your KV namespace ID.

## Development

Start the development server:

```bash
npm start
```

This will start a local server at http://localhost:8787.

## Testing with MCP Inspector

You can use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to test the server:

1. Install the MCP Inspector:
   ```bash
   npm install -g @modelcontextprotocol/inspector
   ```

2. Run the MCP Inspector:
   ```bash
   mcp-inspector
   ```

3. Connect to your server using the SSE transport type with URL: `http://localhost:8787/sse`

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## API Usage

### Image Detection

```bash
curl -X POST "https://your-worker.workers.dev/v1/mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "request": {
      "function": "detect-image",
      "parameters": {
        "image": "https://example.com/image.jpg"
      }
    }
  }'
```

### Text Analysis

```bash
curl -X POST "https://your-worker.workers.dev/v1/mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "request": {
      "function": "analyze-text",
      "parameters": {
        "text": "Your text to analyze"
      }
    }
  }'
```

## License

MIT
