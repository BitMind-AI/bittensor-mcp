import { Context } from "hono";
import { Env } from "../index";
import { callBittensorAPI } from "../utils/api";
import { BITTENSOR_ENDPOINTS, ERROR_MESSAGES } from "../constants";
import { createMcpResponse } from "../utils/response";

/**
 * Handler for Vision text-to-image requests
 */
export async function visionTextToImageHandler(c: Context<{ Bindings: Env }>, parameters: any) {
  try {
    // Validate parameters
    if (!parameters || !parameters.text_prompts || !Array.isArray(parameters.text_prompts)) {
      return c.json({ 
        error: ERROR_MESSAGES.MISSING_PARAMETERS,
        message: "Missing required parameter: text_prompts (array)"
      }, 400);
    }

    const { 
      text_prompts,
      cfg_scale = 2,
      height = 1024,
      width = 1024,
      steps = 8,
      engine = "proteus"
    } = parameters;

    const apiToken = c.env.BITTENSOR_API_TOKEN;
    
    if (!apiToken) {
      return c.json({ 
        error: ERROR_MESSAGES.API_TOKEN_MISSING
      }, 500);
    }
    
    // Call the Bittensor API
    const result = await callBittensorAPI(
      BITTENSOR_ENDPOINTS.VISION_TEXT_TO_IMAGE,
      { 
        text_prompts,
        cfg_scale,
        height,
        width,
        steps,
        engine
      },
      apiToken
    );
    
    // Return formatted response
    return createMcpResponse([
      {
        type: "text",
        text: "Vision text-to-image results:"
      },
      {
        type: "text",
        text: JSON.stringify(result, null, 2)
      }
    ]);
  } catch (error) {
    console.error("Vision text-to-image error:", error);
    return c.json({ 
      error: ERROR_MESSAGES.API_ERROR,
      message: error instanceof Error ? error.message : "Unknown error processing Vision text-to-image request"
    }, 500);
  }
} 