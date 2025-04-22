import { Context } from 'hono'
import { ERROR_MESSAGES } from '../constants'
import { imageDetectionHandler } from './detect-image'
import { textAnalysisHandler } from './text-analysis'

// Define environment interface
export interface Env {
  BITTENSOR_API_TOKEN: string
  [key: string]: any
}

/**
 * Main handler for MCP requests
 * Routes requests to the appropriate endpoint handler based on the function name
 */
export async function handleMcpRequest(c: Context<{ Bindings: Env }>) {
  try {
    const body = await c.req.json()

    // Validate request format
    if (!body.request || !body.request.function) {
      return c.json({ error: ERROR_MESSAGES.INVALID_REQUEST }, 400)
    }

    const { function: funcName, parameters } = body.request

    // Route to the appropriate handler
    switch (funcName) {
      case 'detect-image':
        return await imageDetectionHandler(c, parameters)

      // Add more endpoints here
      case 'analyze-text':
        return await textAnalysisHandler(c, parameters)

      default:
        return c.json(
          {
            error: ERROR_MESSAGES.UNSUPPORTED_FUNCTION,
            message: `Function '${funcName}' is not supported`,
          },
          400
        )
    }
  } catch (error) {
    console.error('MCP processing error:', error)
    return c.json(
      {
        error: ERROR_MESSAGES.PROCESSING_ERROR,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
}
