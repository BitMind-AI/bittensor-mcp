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

export class BittensorMCP extends McpAgent {
  server = new McpServer({
    name: SERVER_CONFIG.NAME,
    version: SERVER_CONFIG.VERSION,
  })

  async init() {
    // Image detection tool
    this.server.tool(
      'detect-image',
      { image: z.string().url() },
      async ({ image }: { image: string }) => {
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
      async ({
        text,
        options = {},
      }: {
        text: string
        options?: Record<string, any>
      }) => {
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

    // Chat tool
    this.server.tool(
      'chat',
      {
        messages: z.array(
          z.object({
            role: z.string(),
            content: z.string(),
          })
        ),
        model: z.string().optional(),
        temperature: z.number().optional(),
        max_tokens: z.number().optional(),
        top_p: z.number().optional(),
        stream: z.boolean().optional(),
        logprobs: z.boolean().optional(),
      },
      async (params: {
        messages: Array<{ role: string; content: string }>
        model?: string
        temperature?: number
        max_tokens?: number
        top_p?: number
        stream?: boolean
        logprobs?: boolean
      }) => {
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
            BITTENSOR_ENDPOINTS.CHAT,
            params,
            apiToken
          )

          return {
            content: [
              { type: 'text', text: 'Chat completion results:' },
              { type: 'text', text: JSON.stringify(result, null, 2) },
            ],
          }
        } catch (error) {
          console.error('Chat completion error:', error)
          return {
            content: [
              {
                type: 'text',
                text: `Error processing chat: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`,
              },
            ],
          }
        }
      }
    )

    // QnA tool
    this.server.tool(
      'qna',
      {
        messages: z.array(
          z.object({
            role: z.string(),
            content: z.string(),
          })
        ),
        model: z.string().optional(),
        temperature: z.number().optional(),
        max_tokens: z.number().optional(),
      },
      async (params: {
        messages: Array<{ role: string; content: string }>
        model?: string
        temperature?: number
        max_tokens?: number
      }) => {
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
            BITTENSOR_ENDPOINTS.QNA,
            params,
            apiToken
          )

          return {
            content: [
              { type: 'text', text: 'QnA results:' },
              { type: 'text', text: JSON.stringify(result, null, 2) },
            ],
          }
        } catch (error) {
          console.error('QnA error:', error)
          return {
            content: [
              {
                type: 'text',
                text: `Error processing QnA: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`,
              },
            ],
          }
        }
      }
    )

    // Search tool
    this.server.tool(
      'search',
      {
        query: z.string(),
        limit: z.number().optional(),
      },
      async (params: { query: string; limit?: number }) => {
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
            BITTENSOR_ENDPOINTS.SEARCH,
            params,
            apiToken
          )

          return {
            content: [
              { type: 'text', text: 'Search results:' },
              { type: 'text', text: JSON.stringify(result, null, 2) },
            ],
          }
        } catch (error) {
          console.error('Search error:', error)
          return {
            content: [
              {
                type: 'text',
                text: `Error processing search: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`,
              },
            ],
          }
        }
      }
    )

    // Text to image tool
    this.server.tool(
      'text-to-image',
      {
        prompt: z.string(),
        negative_prompt: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        num_inference_steps: z.number().optional(),
        guidance_scale: z.number().optional(),
      },
      async (params: {
        prompt: string
        negative_prompt?: string
        width?: number
        height?: number
        num_inference_steps?: number
        guidance_scale?: number
      }) => {
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
            BITTENSOR_ENDPOINTS.TEXT_TO_IMAGE,
            params,
            apiToken
          )

          return {
            content: [
              { type: 'text', text: 'Text to image results:' },
              { type: 'text', text: JSON.stringify(result, null, 2) },
            ],
          }
        } catch (error) {
          console.error('Text to image error:', error)
          return {
            content: [
              {
                type: 'text',
                text: `Error processing text to image: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`,
              },
            ],
          }
        }
      }
    )

    // Image to image tool
    this.server.tool(
      'image-to-image',
      {
        image: z.string().url(),
        prompt: z.string(),
        negative_prompt: z.string().optional(),
        strength: z.number().optional(),
        num_inference_steps: z.number().optional(),
        guidance_scale: z.number().optional(),
      },
      async (params: {
        image: string
        prompt: string
        negative_prompt?: string
        strength?: number
        num_inference_steps?: number
        guidance_scale?: number
      }) => {
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
            BITTENSOR_ENDPOINTS.IMAGE_TO_IMAGE,
            params,
            apiToken
          )

          return {
            content: [
              { type: 'text', text: 'Image to image results:' },
              { type: 'text', text: JSON.stringify(result, null, 2) },
            ],
          }
        } catch (error) {
          console.error('Image to image error:', error)
          return {
            content: [
              {
                type: 'text',
                text: `Error processing image to image: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`,
              },
            ],
          }
        }
      }
    )

    // Cortext chat tool
    this.server.tool(
      'cortext-chat',
      {
        messages: z.array(
          z.object({
            role: z.string(),
            content: z.string(),
          })
        ),
        model: z.string().optional(),
        temperature: z.number().optional(),
        max_tokens: z.number().optional(),
      },
      async (params: {
        messages: Array<{ role: string; content: string }>
        model?: string
        temperature?: number
        max_tokens?: number
      }) => {
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
            BITTENSOR_ENDPOINTS.CORTEXT_CHAT,
            params,
            apiToken
          )

          return {
            content: [
              { type: 'text', text: 'Cortext chat results:' },
              { type: 'text', text: JSON.stringify(result, null, 2) },
            ],
          }
        } catch (error) {
          console.error('Cortext chat error:', error)
          return {
            content: [
              {
                type: 'text',
                text: `Error processing cortext chat: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`,
              },
            ],
          }
        }
      }
    )

    // Cortext completions tool
    this.server.tool(
      'cortext-completions',
      {
        prompt: z.string(),
        model: z.string().optional(),
        temperature: z.number().optional(),
        max_tokens: z.number().optional(),
      },
      async (params: {
        prompt: string
        model?: string
        temperature?: number
        max_tokens?: number
      }) => {
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
            BITTENSOR_ENDPOINTS.CORTEXT_COMPLETIONS,
            params,
            apiToken
          )

          return {
            content: [
              { type: 'text', text: 'Cortext completions results:' },
              { type: 'text', text: JSON.stringify(result, null, 2) },
            ],
          }
        } catch (error) {
          console.error('Cortext completions error:', error)
          return {
            content: [
              {
                type: 'text',
                text: `Error processing cortext completions: ${
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
  apiHandler: BittensorMCP.mount('/sse'),
  // @ts-ignore
  defaultHandler: app,
  authorizeEndpoint: '/authorize',
  tokenEndpoint: '/token',
  clientRegistrationEndpoint: '/register',
})
