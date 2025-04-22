import { Context } from "hono";
import { Env } from "../index";
import { callBittensorAPI } from "../utils/api";
import { BITTENSOR_ENDPOINTS, ERROR_MESSAGES } from "../constants";
import { createMcpResponse } from "../utils/response";

/**
 * Handler for image-to-image requests
 */
export async function imageToImageHandler(c: Context<{ Bindings: Env }>, parameters: any) {
  try {
    // Validate parameters
    if (!parameters || !parameters.prompt || !parameters.init_image) {
      return c.json({ 
        error: ERROR_MESSAGES.MISSING_PARAMETERS,
        message: "Missing required parameters: prompt and init_image"
      }, 400);
    }

    const { 
      prompt,
      init_image,
      model = "dataautogpt3/ProteusV0.4-Lightning",
      steps = 10,
      cfg_scale = 3,
      height = 1024,
      width = 1024,
      negative_prompt = "",
      image_strength = 0.5
    } = parameters;

    const apiToken = c.env.BITTENSOR_API_TOKEN;
    
    if (!apiToken) {
      return c.json({ 
        error: ERROR_MESSAGES.API_TOKEN_MISSING
      }, 500);
    }
    
    // Call the Bittensor API
    const result = await callBittensorAPI(
      BITTENSOR_ENDPOINTS.IMAGE_TO_IMAGE,
      { 
        prompt,
        init_image,
        model,
        steps,
        cfg_scale,
        height,
        width,
        negative_prompt,
        image_strength
      },
      apiToken
    );
    
    // Return formatted response
    return createMcpResponse([
      {
        type: "text",
        text: "Image-to-image results:"
      },
      {
        type: "text",
        text: JSON.stringify(result, null, 2)
      }
    ]);
  } catch (error) {
    console.error("Image-to-image error:", error);
    return c.json({ 
      error: ERROR_MESSAGES.API_ERROR,
      message: error instanceof Error ? error.message : "Unknown error processing image-to-image request"
    }, 500);
  }
} 