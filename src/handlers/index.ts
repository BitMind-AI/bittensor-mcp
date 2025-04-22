import { Context } from "hono";
import { Env } from "../index";
import { imageDetectionHandler } from "./detect-image";
import { textAnalysisHandler } from "./text-analysis";
import { chatHandler } from "./chat";
import { qnaHandler } from "./qna";
import { cortextChatHandler } from "./cortext-chat";
import { cortextCompletionsHandler } from "./cortext-completions";
import { visionTextToImageHandler } from "./vision-text-to-image";
import { searchHandler } from "./search";
import { imageToImageHandler } from './image-to-image';
import { ERROR_MESSAGES } from "../constants";

/**
 * Main handler for MCP requests
 * Routes requests to the appropriate endpoint handler based on the function name
 */
export async function handleMcpRequest(c: Context<{ Bindings: Env }>) {
  try {
    const body = await c.req.json();
    
    // Validate request format
    if (!body.request || !body.request.function) {
      return c.json({ error: ERROR_MESSAGES.INVALID_REQUEST }, 400);
    }
    
    const { function: funcName, parameters } = body.request;
    
    // Route to the appropriate handler
    switch (funcName) {
      case 'detect-image':
        return await imageDetectionHandler(c, parameters);
      
      case 'analyze-text':
        return await textAnalysisHandler(c, parameters);
      
      case 'chat':
        return await chatHandler(c, parameters);
      
      case 'qna':
        return await qnaHandler(c, parameters);
      
      case 'cortext-chat':
        return await cortextChatHandler(c, parameters);
      
      case 'cortext-completions':
        return await cortextCompletionsHandler(c, parameters);
      
      case 'text-to-image':
        return await visionTextToImageHandler(c, parameters);
      
      case 'search':
        return await searchHandler(c, parameters);
      
      case 'image-to-image':
        return imageToImageHandler(c, parameters);
      
      default:
        return c.json({ 
          error: ERROR_MESSAGES.UNSUPPORTED_FUNCTION,
          message: `Function '${funcName}' is not supported`
        }, 400);
    }
  } catch (error) {
    console.error("MCP processing error:", error);
    return c.json({ 
      error: ERROR_MESSAGES.PROCESSING_ERROR, 
      message: error instanceof Error ? error.message : "Unknown error" 
    }, 500);
  }
}