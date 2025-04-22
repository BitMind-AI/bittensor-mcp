/**
 * Utility functions for response formatting
 */

// Types for MCP content items
export type TextContent = {
  type: "text";
  text: string;
};

export type McpContent = TextContent;

/**
 * Create a standard MCP response with proper formatting
 * @param content - Array of content items to include in the response
 * @param isError - Whether this is an error response
 * @returns Properly formatted Response object
 */
export function createMcpResponse(content: McpContent[], isError = false) {
  return new Response(
    JSON.stringify({
      response: {
        status: isError ? "error" : "success",
        content
      }
    }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
}

/**
 * Create an error response with MCP formatting
 * @param message - Error message
 * @param status - HTTP status code
 * @returns Formatted error response
 */
export function createErrorResponse(message: string, status = 400) {
  return new Response(
    JSON.stringify({
      response: {
        status: "error",
        error: message,
        content: [
          {
            type: "text",
            text: message
          }
        ]
      }
    }),
    {
      status,
      headers: { "Content-Type": "application/json" }
    }
  );
}