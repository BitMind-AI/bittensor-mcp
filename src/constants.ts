/**
 * API endpoints and configuration
 */

// Bittensor API base URL
export const BITTENSOR_BASE_URL = 'https://api.bitmind.ai/oracle/v1'

// API endpoints
export const BITTENSOR_ENDPOINTS = {
  DETECT_IMAGE: `${BITTENSOR_BASE_URL}/34/detect-image`,
  TEXT_ANALYSIS: `${BITTENSOR_BASE_URL}/32/detect-text`,
  CHAT: `${BITTENSOR_BASE_URL}/1/chat`,
  QNA: `${BITTENSOR_BASE_URL}/20/chat`,
  CORTEXT_CHAT: `${BITTENSOR_BASE_URL}/19/chat/completions`,
  CORTEXT_COMPLETIONS: `${BITTENSOR_BASE_URL}/19/completions`,
  IMAGE_TO_IMAGE: `${BITTENSOR_BASE_URL}/19/image-to-image`,
  TEXT_TO_IMAGE: `${BITTENSOR_BASE_URL}/19/text-to-image`,
  SEARCH: `${BITTENSOR_BASE_URL}/22/search`,
}

// Server configuration
export const SERVER_CONFIG = {
  NAME: 'Bittensor MCP by BitMind',
  VERSION: '1.0.0',
}

// Error messages
export const ERROR_MESSAGES = {
  INVALID_REQUEST: 'Invalid MCP request format',
  UNSUPPORTED_FUNCTION: 'Unsupported function',
  PROCESSING_ERROR: 'Error processing MCP request',
  API_ERROR: 'Bittensor API error',
  API_TOKEN_MISSING: 'Bittensor API token not configured',
  MISSING_PARAMETERS: 'Missing required parameters',
}
