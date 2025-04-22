import OAuthProvider from '@cloudflare/workers-oauth-provider'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { McpAgent } from 'agents/mcp'
import { z } from 'zod'
import app from './app'
import { BITTENSOR_ENDPOINTS, SERVER_CONFIG } from './constants'
import { callBittensorAPI } from './utils/api'

// Define environment interface
export interface Env {
  BITTENSOR_API_TOKEN: string
  [key: string]: any
}

export class MyMCP extends McpAgent {
  server = new McpServer({
    name: SERVER_CONFIG.NAME,
    version: SERVER_CONFIG.VERSION,
  })

  async init() {
    // Simple add tool (example)
    this.server.tool(
      'add',
      { a: z.number(), b: z.number() },
      async ({ a, b }) => ({
        content: [{ type: 'text', text: String(a + b) }],
      })
    )

    // Image detection tool
    this.server.tool(
      'detect-image',
      { image: z.string().url() },
      async ({ image }) => {
        try {
          // @ts-ignore - Access environment variables
          const apiToken = this.env.BITTENSOR_API_TOKEN

          if (!apiToken) {
            return {
              content: [
                {
                  type: 'text',
                  text: 'Error: Bittensor API token not configured',
                },
              ],
            }
          }

          // Call the Bittensor API
          const result = await callBittensorAPI(
            BITTENSOR_ENDPOINTS.DETECT_IMAGE,
            { image },
            apiToken
          )

          return {
            content: [
              { type: 'text', text: 'Image detection results:' },
              { type: 'text', text: JSON.stringify(result, null, 2) },
            ],
          }
        } catch (error) {
          console.error('Image detection error:', error)
          return {
            content: [
              {
                type: 'text',
                text: `Error processing image: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`,
              },
            ],
          }
        }
      }
    )

    // Text analysis tool
    this.server.tool(
      'analyze-text',
      {
        text: z.string(),
        options: z.object({}).optional(),
      },
      async ({ text, options = {} }) => {
        try {
          // @ts-ignore - Access environment variables
          const apiToken = this.env.BITTENSOR_API_TOKEN

          if (!apiToken) {
            return {
              content: [
                {
                  type: 'text',
                  text: 'Error: Bittensor API token not configured',
                },
              ],
            }
          }

          // Call the Bittensor API
          const result = await callBittensorAPI(
            BITTENSOR_ENDPOINTS.TEXT_ANALYSIS,
            { text, options },
            apiToken
          )

          return {
            content: [
              { type: 'text', text: 'Text analysis results:' },
              { type: 'text', text: JSON.stringify(result, null, 2) },
            ],
          }
        } catch (error) {
          console.error('Text analysis error:', error)
          return {
            content: [
              {
                type: 'text',
                text: `Error processing text: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`,
              },
            ],
          }
        }
      }
    )
  }
}

// Export the OAuth handler as the default
export default new OAuthProvider({
  apiRoute: '/sse',
  // TODO: fix these types
  // @ts-ignore
  apiHandler: MyMCP.mount('/sse'),
  // @ts-ignore
  defaultHandler: app,
  authorizeEndpoint: '/authorize',
  tokenEndpoint: '/token',
  clientRegistrationEndpoint: '/register',
})
