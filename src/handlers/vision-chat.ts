import { Context } from "hono";
import { Env } from "../index";
import { callBittensorAPI } from "../utils/api";
import { BITTENSOR_ENDPOINTS, ERROR_MESSAGES } from "../constants";
import { createMcpResponse } from "../utils/response";

/**
 * Handler for Vision chat requests
 */
export async function visionChatHandler(c: Context<{ Bindings: Env }>, parameters: any) {
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
      model = "llama-3",
      temperature = 0.1,
      max_tokens = 100,
      top_p = 1,
      stream = false,
      logprobs = false
    } = parameters;

    const apiToken = c.env.BITTENSOR_API_TOKEN;
    
    if (!apiToken) {
      return c.json({ 
        error: ERROR_MESSAGES.API_TOKEN_MISSING
      }, 500);
    }
    
    // Call the Bittensor API
    const result = await callBittensorAPI(
      BITTENSOR_ENDPOINTS.VISION_CHAT,
      { 
        messages,
        model,
        temperature,
        max_tokens,
        top_p,
        stream,
        logprobs
      },
      apiToken
    );
    
    // Return formatted response
    return createMcpResponse([
      {
        type: "text",
        text: "Vision chat results:"
      },
      {
        type: "text",
        text: JSON.stringify(result, null, 2)
      }
    ]);
  } catch (error) {
    console.error("Vision chat error:", error);
    return c.json({ 
      error: ERROR_MESSAGES.API_ERROR,
      message: error instanceof Error ? error.message : "Unknown error processing Vision chat request"
    }, 500);
  }
} 