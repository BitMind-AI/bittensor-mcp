# Bittensor MCP Server

[![npm version](https://img.shields.io/npm/v/@bitmind/bittensor-mcp.svg)](https://www.npmjs.com/package/@bitmind/bittensor-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that provides access to most of Bittensor's subnets using BitMind's oracle-api, allowing AI assistants like Claude to interact with Bittensor's network.

## What is MCP?

The Model Context Protocol (MCP) is a standardized way for AI assistants to interact with external tools and data sources. This server implements the MCP specification to provide access to Bittensor's network of AI models.

## Quick Start

### Prerequisites

- A Bittensor API token from [BitMind](https://bitmind.ai)

### Configuration

To use this MCP server with Claude or other MCP clients, add it to your configuration:

```json
{
  "mcpServers": {
    "bittensor": {
      "command": "npx",
      "args": ["-y", "@bitmind/bittensor-mcp"],
      "env": {
        "BITMIND_API_TOKEN": "<YOUR_API_TOKEN>"
      }
    }
  }
}
```

That's it! Claude will now be able to access Bittensor's subnets through this MCP server.

## For Developers

If you're interested in contributing to this project or running it locally, please see the [Development Guide](DEVELOPMENT.md) for detailed instructions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
