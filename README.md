# Bittensor MCP Server

## Installation

Local development

```json
{
  "mcpServers": {
    "bittensor": {
      "command": "node",
      "args": ["/PATH/TO/bittensor-mcp/build/index.js"],
      "env": {
        "BITMIND_API_TOKEN": "<YOUR_API_TOKEN>"
      }
    }
  }
}
```

Production

```json
{
  "mcpServers": {
    "bitmind": {
      "command": "npx",
      "args": ["-y", "@bitmind/bittensor-mcp"],
      "env": {
        "BITMIND_API_TOKEN": "<YOUR_API_TOKEN>"
      }
    }
  }
}
```
