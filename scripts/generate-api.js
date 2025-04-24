import fs from 'fs'
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
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'generated')

// Ensure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Read the OpenAPI spec
const openapiSpec = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf-8'))

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
    'presence_penalty',
  ]
  return (
    numericFields.includes(key) ||
    value.type === 'number' ||
    value.type === 'integer'
  )
}

// Generate API client content
const generateApiClientContent = (paths) => {
  const apiFunctions = []
  const responseTypes = new Set()

  for (const [path, methods] of Object.entries(paths)) {
    const postMethod = methods.post
    if (postMethod) {
      const operationId = `subnet_${path.replace(/[\/-]/g, '_').slice(1)}`
      const responseSchema =
        postMethod.responses['200']?.content?.['application/json']?.schema

      if (responseSchema) {
        const responseType = generateTypeScriptType(responseSchema)
        responseTypes.add(responseType)
      }

      apiFunctions.push(`
export async function ${operationId}(params: any): Promise<any> {
  return makeApiRequest(\`${path}\`, {
    method: "POST",
    body: params,
  });
}`)
    }
  }

  return {
    responseTypes: Array.from(responseTypes).join('\n\n'),
    apiFunctions: apiFunctions.join('\n'),
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
    const postMethod = methods.post
    if (postMethod) {
      const operationId =
        postMethod.operationId || path.replace(/\//g, '-').slice(1)
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
        const response = await api.subnet_${path
          .replace(/[\/-]/g, '_')
          .slice(1)}(params);
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
        return `${key}: ${generateZodType(value)}`
      })
      .join(', ')
    return `z.object({ ${properties} })`
  } else if (schema.type === 'string') {
    return 'z.string()'
  } else if (schema.type === 'number' || schema.type === 'integer') {
    return 'z.number()'
  } else if (schema.type === 'boolean') {
    return 'z.boolean()'
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
