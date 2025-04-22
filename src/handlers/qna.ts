import { Context } from "hono";
import { Env } from "../index";
import { callBittensorAPI } from "../utils/api";
import { BITTENSOR_ENDPOINTS, ERROR_MESSAGES } from "../constants";
import { createMcpResponse } from "../utils/response";

/**
 * Handler for QnA requests
 */
export async function qnaHandler(c: Context<{ Bindings: Env }>, parameters: any) {
  try {
    // Validate parameters
    if (!parameters || !parameters.messages || !Array.isArray(parameters.messages)) {
      return c.json({ 
        error: ERROR_MESSAGES.MISSING_PARAMETERS,
        message: "Missing required parameter: messages (array)"
      }, 400);
    }

    const { 
      messages,
      tools = []
    } = parameters;

    const apiToken = c.env.BITTENSOR_API_TOKEN;
    
    if (!apiToken) {
      return c.json({ 
        error: ERROR_MESSAGES.API_TOKEN_MISSING
      }, 500);
    }
    
    // Call the Bittensor API
    const result = await callBittensorAPI(
      BITTENSOR_ENDPOINTS.QNA,
      { 
        messages,
        tools
      },
      apiToken
    );
    
    // Return formatted response
    return createMcpResponse([
      {
        type: "text",
        text: "QnA results:"
      },
      {
        type: "text",
        text: JSON.stringify(result, null, 2)
      }
    ]);
  } catch (error) {
    console.error("QnA error:", error);
    return c.json({ 
      error: ERROR_MESSAGES.API_ERROR,
      message: error instanceof Error ? error.message : "Unknown error processing QnA request"
    }, 500);
  }
} 