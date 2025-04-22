import { Context } from 'hono'
import { BITTENSOR_ENDPOINTS, ERROR_MESSAGES } from '../constants'
import { callBittensorAPI } from '../utils/api'
import { createMcpResponse } from '../utils/response'
import { Env } from './index'

/**
 * Handler for text analysis requests
 * NOTE: Uncomment and update this when implementing text analysis endpoint
 */
export async function textAnalysisHandler(
  c: Context<{ Bindings: Env }>,
  parameters: any
) {
  try {
    // Validate parameters
    if (!parameters || !parameters.text) {
      return c.json(
        {
          error: ERROR_MESSAGES.MISSING_PARAMETERS,
          message: 'Missing required parameter: text',
        },
        400
      )
    }

    const { text, options = {} } = parameters
    const apiToken = c.env.BITTENSOR_API_TOKEN

    if (!apiToken) {
      return c.json(
        {
          error: ERROR_MESSAGES.API_TOKEN_MISSING,
        },
        500
      )
    }

    // Call the Bittensor API
    const result = await callBittensorAPI(
      BITTENSOR_ENDPOINTS.TEXT_ANALYSIS,
      {
        text,
        options,
      },
      apiToken
    )

    // Return formatted response
    return createMcpResponse([
      {
        type: 'text',
        text: 'Text analysis results:',
      },
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ])
  } catch (error) {
    console.error('Text analysis error:', error)
    return c.json(
      {
        error: ERROR_MESSAGES.API_ERROR,
        message:
          error instanceof Error
            ? error.message
            : 'Unknown error processing text',
      },
      500
    )
  }
}
