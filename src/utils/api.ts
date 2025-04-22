/**
 * Utility functions for API calls
 */

/**
 * Call the Bittensor API with proper authentication
 * @param url - API endpoint URL
 * @param body - Request body
 * @param token - API token for authentication
 * @returns Response data from the API
 */
export async function callBittensorAPI(url: string, body: any, token: string) {
  console.log(`Calling Bittensor API: ${url}`);
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Bittensor API error: ${response.status} - ${errorText}`);
  }

  const responseText = await response.text();
  let result;
  
  try {
    // Try parsing as regular JSON first
    result = JSON.parse(responseText);
  } catch (e) {
    // If that fails, check if it's a data: prefixed response
    if (responseText.startsWith('data:')) {
      try {
        // Remove the data: prefix and parse the rest as JSON
        result = JSON.parse(responseText.substring(5));
      } catch (e2) {
        throw new Error(`Failed to parse API response: ${responseText}`);
      }
    } else {
      throw new Error(`Failed to parse API response: ${responseText}`);
    }
  }

  console.log("API call successful");
  return result;
}

/**
 * Validate required parameters in a request
 * @param params - Request parameters
 * @param requiredParams - List of required parameter names
 * @returns Error message or null if valid
 */
export function validateParams(params: any, requiredParams: string[]): string | null {
  if (!params) {
    return "No parameters provided";
  }
  
  for (const param of requiredParams) {
    if (params[param] === undefined || params[param] === null) {
      return `Missing required parameter: ${param}`;
    }
  }
  
  return null;
}