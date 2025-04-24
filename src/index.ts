#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { registerGeneratedRoutes } from './generated/routes.js'

// Get configuration from environment variables
export const API_BASE_URL =
  process.env.BITMIND_API_BASE_URL || 'https://api.bitmind.ai/oracle/v1'
const API_TOKEN = process.env.BITMIND_API_TOKEN

// Validate required configuration
if (!API_TOKEN) {
  process.stderr.write(
    'Error: BITMIND_API_TOKEN environment variable is required\n'
  )
  process.exit(1)
}

// Create server instance
const server = new McpServer({
  name: 'bittensor',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
})

// Register generated routes
registerGeneratedRoutes(server)

async function main() {
  try {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    process.stderr.write('Bittensor MCP Server running on stdio\n')
  } catch (error) {
    process.stderr.write(`Error: ${error}\n`)
    process.exit(1)
  }
}

main().catch((error) => {
  process.stderr.write(`Fatal error in main(): ${error}\n`)
  process.exit(1)
})
