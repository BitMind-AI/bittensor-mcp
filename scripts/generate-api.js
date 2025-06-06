import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OPENAPI_PATH = path.join(
  __dirname,
  '..',
  'subnet-io-registry',
  'docs',
  'openapi.json'
)
const SUBNETS_DIR = path.join(__dirname, '..', 'subnet-io-registry', 'subnets')
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'generated')

// Ensure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Read the OpenAPI spec
const openapiSpec = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf-8'))

// Read the external paths from the API YAML files
const externalPaths = {}

// Function to read external paths from API YAML files
function readExternalPaths() {
  // Get all subnet directories
  const subnetDirs = fs.readdirSync(SUBNETS_DIR)

  for (const subnetDir of subnetDirs) {
    const subnetPath = path.join(SUBNETS_DIR, subnetDir)

    // Skip if not a directory
    if (!fs.statSync(subnetPath).isDirectory()) {
      continue
    }

    // Check if api.yml exists
    const apiYamlPath = path.join(subnetPath, 'api.yml')
    if (!fs.existsSync(apiYamlPath)) {
      continue
    }

    try {
      // Read and parse the API YAML file
      const apiYaml = yaml.load(fs.readFileSync(apiYamlPath, 'utf8'))

      // Process endpoints
      if (apiYaml.endpoints) {
        for (const endpoint of apiYaml.endpoints) {
          if (endpoint.externalPath) {
            // Create a key based on the subnet ID and path
            let apiPath = `/${subnetDir}${endpoint.path}`

            // Handle path parameters
            if (endpoint.pathParams) {
              for (const param of endpoint.pathParams) {
                if (param.name) {
                  apiPath = `/${subnetDir}${endpoint.path}/{${param.name}}`
                }
              }
            }

            // Store the external path
            externalPaths[apiPath] = endpoint.externalPath
          }
        }
      }
    } catch (error) {
      console.error(`Error reading API YAML file ${apiYamlPath}:`, error)
    }
  }
}

// Read external paths
readExternalPaths()

// Helper function to determine if a field should be numeric
function shouldBeNumeric(key, value) {
  const numericFields = [
    'max_tokens',
    'steps',
    'width',
    'height',
    'cfg_scale',
    'temperature',
    'top_p',
    'frequency_penalty',
    'presence_penalty'
  ]
  return (
    numericFields.includes(key) ||
    value.type === 'number' ||
    value.type === 'integer'
  )
}

// Helper function to generate consistent names
function generateConsistentName(path, pathParams = []) {
  const pathParts = path.split('/')
  const subnetId = pathParts[1]
  const endpointName = pathParts
    .slice(2)
    .join('_')
    .replace(/[\/-]/g, '_')
    .replace(/\{([^}]+)\}/g, '')

  if (pathParams.length > 0) {
    return `subnet_${subnetId}__${endpointName}by_${pathParams.map((p) => p.name).join('_and_')}`
  }
  return `subnet_${subnetId}__${endpointName}`
}

// Generate API client content
const generateApiClientContent = (paths) => {
  const apiFunctions = []
  const responseTypes = new Set()

  for (const [path, methods] of Object.entries(paths)) {
    // Handle POST methods
    const postMethod = methods.post
    if (postMethod) {
      const operationId = generateConsistentName(path)
      const responseSchema =
        postMethod.responses['200']?.content?.['application/json']?.schema

      if (responseSchema) {
        const responseType = generateTypeScriptType(responseSchema)
        responseTypes.add(responseType)
      }

      // Always use the original path, not the external path
      const requestPath = path

      apiFunctions.push(`
export async function ${operationId}(params: any): Promise<any> {
  return makeApiRequest(\`${requestPath}\`, {
    method: "POST",
    body: params,
  });
}`)
    }

    // Handle GET methods
    const getMethod = methods.get
    if (getMethod) {
      const pathParams =
        getMethod.parameters?.filter((param) => param.in === 'path') || []
      const operationId = generateConsistentName(path, pathParams)
      const responseSchema =
        getMethod.responses['200']?.content?.['application/json']?.schema

      if (responseSchema) {
        const responseType = generateTypeScriptType(responseSchema)
        responseTypes.add(responseType)
      }

      // Always use the original path, not the external path
      const requestPath = path

      if (pathParams.length > 0) {
        // Create a typed interface for the parameters
        const paramsInterface = pathParams
          .map((param) => `  ${param.name}: string;`)
          .join('\n')

        apiFunctions.push(`
// Interface for ${operationId} parameters
interface ${operationId.charAt(0).toUpperCase() + operationId.slice(1)}Params {
${paramsInterface}
}

export async function ${operationId}(params: ${operationId.charAt(0).toUpperCase() + operationId.slice(1)}Params): Promise<any> {
  // Replace path parameters with actual values
  let url = \`${requestPath}\`;
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(\`{$\{key}}\`, value);
  }
  
  return makeApiRequest(url, {
    method: "GET"
  });
}`)
      } else {
        apiFunctions.push(`
export async function ${operationId}(params: any = {}): Promise<any> {
  return makeApiRequest(\`${requestPath}\`, {
    method: "GET"
  });
}`)
      }
    }
  }

  return {
    responseTypes: Array.from(responseTypes).join('\n\n'),
    apiFunctions: apiFunctions.join('\n')
  }
}

// Generate TypeScript type from schema
function generateTypeScriptType(schema) {
  if (schema.type === 'object') {
    const properties = Object.entries(schema.properties || {})
      .map(([key, value]) => {
        const isRequired = (schema.required || []).includes(key)
        return `${key}${isRequired ? '' : '?'}: ${generateTypeScriptType(
          value
        )}`
      })
      .join(';\n  ')
    return `{\n  ${properties}\n}`
  } else if (schema.type === 'string') {
    return schema.enum ? schema.enum.map((e) => `"${e}"`).join(' | ') : 'string'
  } else if (schema.type === 'number' || schema.type === 'integer') {
    return 'number'
  } else if (schema.type === 'boolean') {
    return 'boolean'
  } else if (schema.type === 'array') {
    return `${generateTypeScriptType(schema.items)}[]`
  }
  return 'any'
}

// Generate the routes file content
const generateRoutesContent = (paths) => {
  const routes = []

  for (const [path, methods] of Object.entries(paths)) {
    // Handle POST methods
    const postMethod = methods.post
    if (postMethod) {
      const operationId = generateConsistentName(path)
      const summary = postMethod.summary || ''
      const parameters =
        postMethod.requestBody?.content?.['application/json']?.schema
          ?.properties || {}

      // Generate Zod schema for parameters
      const zodSchema = Object.entries(parameters)
        .map(([key, value]) => {
          const description = value.description
            ? `.describe(${JSON.stringify(value.description)})`
            : ''
          let type = 'z.string()'

          if (shouldBeNumeric(key, value)) {
            type = 'z.number()'
          } else if (value.type === 'boolean') {
            type = 'z.boolean()'
          } else if (value.type === 'array') {
            if (key === 'messages') {
              type = `z.array(z.object({ 
                role: z.enum(["user", "assistant", "system"]), 
                content: z.string() 
              }))`
            } else {
              type = `z.array(${generateZodType(value.items)})`
            }
          } else if (value.type === 'object') {
            // Handle nested objects properly
            type = generateZodType(value)
          } else if (value.enum) {
            type = `z.enum([${value.enum.map((e) => `"${e}"`).join(', ')}])`
          }

          const defaultValue =
            value.default !== undefined
              ? `.default(${JSON.stringify(value.default)})`
              : ''
          return `      ${key}: ${type}${defaultValue}${description}`
        })
        .join(',\n')

      // Generate route registration
      routes.push(`
  // Register ${operationId} endpoint
  server.tool(
    "${operationId}",
    "${summary}",
    {
${zodSchema}
    },
    async (params) => {
      try {
        const response = await api.${operationId}(params);
        
        // Check if response contains image data
        if (response && typeof response === 'object' && response.image_b64) {
          // Determine the appropriate MIME type based on the endpoint
          let mimeType = "image/png"; // Default
          const operationId = "${operationId}";
          if (operationId.includes("text-to-image")) {
            mimeType = "image/png";
          } else if (operationId.includes("image-to-image")) {
            mimeType = "image/jpeg";
          } else if (operationId.includes("avatar")) {
            mimeType = "image/png";
          }
          
          // Create a proper resource URI following the MCP specification
          const resourceUri = \`bittensor://\${operationId}/image\`;
          
          const result = {
            content: [
              {
                type: "resource" as const,
                resource: {
                  uri: resourceUri,
                  mimeType: mimeType,
                  blob: response.image_b64
                }
              }
            ]
          };
          
          return result;
        }
        
        // Default text response handling
        return {
          content: [
            {
              type: "text",
              text: typeof response === "string" 
                ? response 
                : (response && typeof response === "object" 
                  ? JSON.stringify(response, null, 2) 
                  : String(response)),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: \`Error: \${error?.message || "Unknown error occurred"}\`,
            },
          ],
          isError: true,
        };
      }
    }
  );`)
    }

    // Handle GET methods
    const getMethod = methods.get
    if (getMethod) {
      const pathParams =
        getMethod.parameters?.filter((param) => param.in === 'path') || []
      const operationId = generateConsistentName(path, pathParams)
      const summary = getMethod.summary || ''

      // Generate Zod schema for path parameters
      const zodSchema = pathParams
        .map((param) => {
          const description = param.description
            ? `.describe(${JSON.stringify(param.description)})`
            : ''
          let type = 'z.string()'

          if (
            param.schema?.type === 'integer' ||
            param.schema?.type === 'number'
          ) {
            type = 'z.string().transform(val => parseInt(val))'
          }

          return `      ${param.name}: ${type}${description}`
        })
        .join(',\n')

      // Generate route registration for GET endpoints
      routes.push(`
  // Register ${operationId} endpoint
  server.tool(
    "${operationId}",
    "${summary}",
    {
${zodSchema || '      // No parameters required'}
    },
    async (params) => {
      try {
        const response = await api.${operationId}(params);
        
        // Default text response handling
        return {
          content: [
            {
              type: "text",
              text: typeof response === "string" 
                ? response 
                : (response && typeof response === "object" 
                  ? JSON.stringify(response, null, 2) 
                  : String(response)),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: \`Error: \${error?.message || "Unknown error occurred"}\`,
            },
          ],
          isError: true,
        };
      }
    }
  );`)
    }
  }

  return routes.join('\n')
}

// Helper function to generate Zod type for nested objects
function generateZodType(schema) {
  if (schema.type === 'object') {
    const properties = Object.entries(schema.properties || {})
      .map(([key, value]) => {
        // Check if the property is required
        const isRequired = (schema.required || []).includes(key)

        // Generate the property type
        let propType = generateZodType(value)

        // Add default value if present
        if (value.default !== undefined) {
          propType += `.default(${JSON.stringify(value.default)})`
        }

        // Add optional modifier if not required
        if (!isRequired) {
          propType += '.optional()'
        }

        // Add description if present
        if (value.description) {
          propType += `.describe(${JSON.stringify(value.description)})`
        }

        return `${key}: ${propType}`
      })
      .join(', ')
    return `z.object({ ${properties} })`
  } else if (schema.type === 'string') {
    return schema.enum
      ? `z.enum([${schema.enum.map((e) => `"${e}"`).join(', ')}])`
      : 'z.string()'
  } else if (schema.type === 'number' || schema.type === 'integer') {
    return 'z.number()'
  } else if (schema.type === 'boolean') {
    return 'z.boolean()'
  } else if (schema.type === 'array') {
    return `z.array(${generateZodType(schema.items)})`
  } else if (schema.enum) {
    return `z.enum([${schema.enum.map((e) => `"${e}"`).join(', ')}])`
  }
  return 'z.unknown()'
}

// Generate API client file content
const apiClientContent = `/**
 * WARNING: This file is automatically generated.
 * DO NOT EDIT THIS FILE DIRECTLY.
 * Any changes should be made to the generation scripts instead.
 */

import fetch from "node-fetch";
import { API_BASE_URL } from "../index.js";

const API_KEY = process.env.BITMIND_API_TOKEN;

// API key validation is handled in index.ts
// Just ensure it's available for the request

interface ApiRequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

async function makeApiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  if (!API_KEY) {
    throw new Error("BITMIND_API_TOKEN environment variable is required");
  }

  const url = \`\${API_BASE_URL}\${endpoint}\`;
  const headers = {
    Authorization: \`Bearer \${API_KEY}\`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(\`API request failed: \${response.status} \${error}\`);
  }

  // Get the response as text first
  const responseText = await response.text();
  
  // Try to parse as JSON, but handle non-JSON responses gracefully
  try {
    // Check if the response starts with special prefixes like "data:" or "debug:"
    if (responseText.trim().startsWith('data:') || 
        responseText.trim().startsWith('debug:') ||
        responseText.includes('<!DOCTYPE html>')) {
      // Return the raw text if it's not JSON
      return responseText as unknown as T;
    }
    
    // Try to parse as JSON
    return JSON.parse(responseText);
  } catch (error) {
    // If JSON parsing fails, return the raw text
    console.error("Failed to parse response as JSON:", error);
    return responseText as unknown as T;
  }
}

${generateApiClientContent(openapiSpec.paths).responseTypes}

${generateApiClientContent(openapiSpec.paths).apiFunctions}
`

// Generate routes file content
const routesContent = `/**
 * WARNING: This file is automatically generated.
 * DO NOT EDIT THIS FILE DIRECTLY.
 * Any changes should be made to the generation scripts instead.
 */

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as api from "./api-client.js";

export function registerGeneratedRoutes(server: McpServer) {${generateRoutesContent(
  openapiSpec.paths
)}
}
`

// Write the generated files
fs.writeFileSync(path.join(OUTPUT_DIR, 'api-client.ts'), apiClientContent)
fs.writeFileSync(path.join(OUTPUT_DIR, 'routes.ts'), routesContent)

console.log('API client and routes files generated successfully!')
