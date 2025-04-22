import { Context } from "hono";
import { Env } from "../index";
import { callBittensorAPI } from "../utils/api";
import { BITTENSOR_ENDPOINTS, ERROR_MESSAGES } from "../constants";
import { createMcpResponse } from "../utils/response";

/**
 * Handler for search requests
 */
export async function searchHandler(c: Context<{ Bindings: Env }>, parameters: any) {
  try {
    // Validate parameters
    if (!parameters || !parameters.prompt) {
      return c.json({ 
        error: ERROR_MESSAGES.MISSING_PARAMETERS,
        message: "Missing required parameter: prompt"
      }, 400);
    }

    const { 
      prompt,
      tools = ["Google Search"],
      model = "NOVA",
      response_order = "LINKS_FIRST",
      date_filter = "PAST_WEEK"
    } = parameters;

    const apiToken = c.env.BITTENSOR_API_TOKEN;
    
    if (!apiToken) {
      return c.json({ 
        error: ERROR_MESSAGES.API_TOKEN_MISSING
      }, 500);
    }
    
    // Call the Bittensor API
    const result = await callBittensorAPI(
      BITTENSOR_ENDPOINTS.SEARCH,
      { 
        prompt,
        tools,
        model,
        response_order,
        date_filter
      },
      apiToken
    );
    
    // Return formatted response
    return createMcpResponse([
      {
        type: "text",
        text: "Search results:"
      },
      {
        type: "text",
        text: JSON.stringify(result, null, 2)
      }
    ]);
  } catch (error) {
    console.error("Search error:", error);
    return c.json({ 
      error: ERROR_MESSAGES.API_ERROR,
      message: error instanceof Error ? error.message : "Unknown error processing search request"
    }, 500);
  }
} 