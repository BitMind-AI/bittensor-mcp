import { Context } from "hono";
import { Env } from "../index";
import { callBittensorAPI } from "../utils/api";
import { BITTENSOR_ENDPOINTS, ERROR_MESSAGES } from "../constants";
import { createMcpResponse } from "../utils/response";

/**
 * Handler for Cortext chat requests
 */
export async function cortextChatHandler(c: Context<{ Bindings: Env }>, parameters: any) {
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
      model = "cortext-ultra",
      temperature = 0.0001,
      max_tokens = 100,
      top_p = 1,
      stream = false,
      seed = 1
    } = parameters;

    const apiToken = c.env.BITTENSOR_API_TOKEN;
    
    if (!apiToken) {
      return c.json({ 
        error: ERROR_MESSAGES.API_TOKEN_MISSING
      }, 500);
    }
    
    // Call the Bittensor API
    const result = await callBittensorAPI(
      BITTENSOR_ENDPOINTS.CORTEXT_CHAT,
      { 
        model,
        messages,
        temperature,
        max_tokens,
        top_p,
        stream,
        seed
      },
      apiToken
    );
    
    // Return formatted response
    return createMcpResponse([
      {
        type: "text",
        text: "Cortext chat results:"
      },
      {
        type: "text",
        text: JSON.stringify(result, null, 2)
      }
    ]);
  } catch (error) {
    console.error("Cortext chat error:", error);
    return c.json({ 
      error: ERROR_MESSAGES.API_ERROR,
      message: error instanceof Error ? error.message : "Unknown error processing Cortext chat request"
    }, 500);
  }
} 