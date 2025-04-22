/**
 * API endpoints and configuration
 */

// Bittensor API base URL
export const BITTENSOR_BASE_URL = "https://api.bitmind.ai/oracle/v1";

// API endpoints
export const BITTENSOR_ENDPOINTS = {
  DETECT_IMAGE: `${BITTENSOR_BASE_URL}/34/detect-image`,
  // Add more endpoints as needed
  TEXT_ANALYSIS: `${BITTENSOR_BASE_URL}/32/detect-text`,
};

// Server configuration
export const SERVER_CONFIG = {
  NAME: "Bittensor MCP Server",
  VERSION: "1.0.0",
};

// Error messages
export const ERROR_MESSAGES = {
  INVALID_REQUEST: "Invalid MCP request format",
  UNSUPPORTED_FUNCTION: "Unsupported function",
  PROCESSING_ERROR: "Error processing MCP request",
  API_ERROR: "Bittensor API error",
  API_TOKEN_MISSING: "Bittensor API token not configured",
  MISSING_PARAMETERS: "Missing required parameters"
};