# Bittensor MCP Server

[![npm version](https://img.shields.io/npm/v/@bitmind/bittensor-mcp.svg)](https://www.npmjs.com/package/@bitmind/bittensor-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that provides access to most of Bittensor's subnets using BitMind's oracle-api, allowing AI assistants like Claude to interact with Bittensor's network.

## What is MCP?

The Model Context Protocol (MCP) is a standardized way for AI assistants to interact with external tools and data sources. This server implements the MCP specification to provide access to Bittensor's network of AI models.

MCP servers can:
- Expose data through **Resources** (similar to GET endpoints in REST APIs)
- Provide functionality through **Tools** (similar to POST endpoints)
- Define interaction patterns through **Prompts** (reusable templates for LLM interactions)

## Installation & Usage

### Prerequisites

- Node.js 22 or higher (recommended)
- A Bittensor API token from [BitMind](https://bitmind.ai)
- Python 3.x (for development only)

### MCP Client Configuration

To use this MCP server with Claude or other MCP clients, add it to your configuration:

```json
{
  "mcpServers": {
    "bittensor": {
      "command": "npx",
      "args": ["-y", "@bitmind/bittensor-mcp"],
      "env": {
        "BITMIND_API_TOKEN": "<YOUR_API_TOKEN>"
      }
    }
  }
}
```

For local development, you can point to your local build:

```json
{
  "mcpServers": {
    "bittensor": {
      "command": "node",
      "args": ["/PATH/TO/bittensor-mcp/build/index.js"],
      "env": {
        "BITMIND_API_TOKEN": "<YOUR_API_TOKEN>"
      }
    }
  }
}
```

## Development

### Setup

Clone the repository with submodules and install dependencies:

```bash
git clone --recursive https://github.com/BitMind-AI/bittensor-mcp.git
cd bittensor-mcp
npm install
```

If you've already cloned the repository without the `--recursive` flag, you can initialize and update the submodule with:

```bash
npm run init-submodule
```

### Development Workflow

```bash
# Generate OpenAPI specification
npm run generate-openapi

# Generate API client
npm run generate-api

# Build the project
npm run build
```

### Testing with MCP Clients

To test your local build with an MCP client like Claude, configure the client to use your local server as shown in the [MCP Client Configuration](#mcp-client-configuration) section.

### Release Workflow

This project uses GitHub Actions for automated releases. The workflow is triggered when you push a tag starting with 'v' (e.g., v1.0.0).

Here's how the release process works:

1. Update the version in package.json
2. Commit your changes
3. Create and push a new tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

When you push the tag, GitHub Actions will:
1. Check out the code with submodules
2. Set up Node.js 22.x and Python
3. Install dependencies
4. Generate the OpenAPI spec and API client
5. Build the project
6. Publish the package to npm

**Important Note**: The tag will appear in GitHub releases regardless of which branch it was created on. However, it's recommended to create tags from the main branch to ensure consistency. If you create a tag from a feature branch, the code at that specific commit will be published, which might not include changes from other branches.

#### Testing the Workflow Locally

To test the release workflow locally before pushing a tag:

1. Make sure you have all dependencies installed:
   ```bash
   npm install
   ```

2. Run the same steps as the GitHub Actions workflow:
   ```bash
   # Initialize and update submodules
   npm run init-submodule
   
   # Generate OpenAPI spec
   npm run generate-openapi
   
   # Generate API client
   npm run generate-api
   
   # Build the project
   npm run build
   ```

3. Test the package locally:
   ```bash
   # Create a tarball
   npm pack
   
   # Install the tarball in another project
   npm install /path/to/bitmind-bittensor-mcp-1.0.0.tgz
   ```

This ensures everything works correctly before triggering the actual release workflow.

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
