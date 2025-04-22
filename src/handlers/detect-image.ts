import { Context } from 'hono'
import { BITTENSOR_ENDPOINTS, ERROR_MESSAGES } from '../constants'
import { callBittensorAPI } from '../utils/api'
import { createMcpResponse } from '../utils/response'
import { Env } from './index'

/**
 * Handler for image detection requests
 */
export async function imageDetectionHandler(
  c: Context<{ Bindings: Env }>,
  parameters: any
) {
  try {
    // Validate parameters
    if (!parameters || !parameters.image) {
      return c.json(
        {
          error: ERROR_MESSAGES.MISSING_PARAMETERS,
          message: 'Missing required parameter: image',
        },
        400
      )
    }

    const { image } = parameters
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
      BITTENSOR_ENDPOINTS.DETECT_IMAGE,
      { image },
      apiToken
    )

    // Return formatted response
    return createMcpResponse([
      {
        type: 'text',
        text: 'Image detection results:',
      },
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ])
  } catch (error) {
    console.error('Image detection error:', error)
    return c.json(
      {
        error: ERROR_MESSAGES.API_ERROR,
        message:
          error instanceof Error
            ? error.message
            : 'Unknown error processing image',
      },
      500
    )
  }
}
