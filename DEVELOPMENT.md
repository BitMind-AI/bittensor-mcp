# Development Guide for Bittensor MCP Server

This guide is intended for developers who want to contribute to or modify the Bittensor MCP server.

## Prerequisites

- Node.js 22 or higher
- Python 3.x (for OpenAPI spec generation)
- Git (for cloning and version control)
- npm (for package management)
- A Bittensor API token from [BitMind](https://bitmind.ai)

## Setup

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

## Development Workflow

### 1. Generate OpenAPI Specification

The API client is generated from the OpenAPI specification. To generate it:

```bash
npm run generate-openapi
```

This script runs the Python script in the subnet-io-registry submodule to generate the OpenAPI specification.

### 2. Generate API Client

After generating the OpenAPI specification, generate the API client:

```bash
npm run generate-api
```

This script uses the OpenAPI specification to generate TypeScript client code.

### 3. Build the Project

Build the TypeScript code:

```bash
npm run build
```

### 4. Testing Locally

To test your changes locally:

```bash
# Set your API token
export BITMIND_API_TOKEN="your-api-token"

# Run the server
node build/index.js
```

To test with an MCP client like Claude, configure the client to use your local server:

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

### 5. Creating a Local Package

To test the package before publishing:

```bash
# Create a tarball
npm pack

# Install the tarball in another project
npm install /path/to/bitmind-bittensor-mcp-1.0.0.tgz
```

## Release Process

### GitHub Actions Workflow

This project uses GitHub Actions for automated releases. The workflow is triggered when you push a tag starting with 'v' (e.g., v1.0.0).

#### Required GitHub Secrets

For the GitHub Actions workflow to work, you need to set up the following secret in your GitHub repository:

- `NPM_TOKEN`: An npm access token with publish permissions

To add this secret:
1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Your npm access token

#### Creating a Release

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

## Project Structure

- `src/`: Source code
  - `index.ts`: Main entry point
  - `generated/`: Generated API client code
- `scripts/`: Build and generation scripts
  - `generate-api.js`: Script to generate API client from OpenAPI spec
- `subnet-io-registry/`: Submodule containing Bittensor subnet API definitions
- `.github/workflows/`: GitHub Actions workflow definitions
- `build/`: Compiled JavaScript code (generated)

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request

## Troubleshooting

### Common Issues

#### Submodule Issues

If you encounter issues with the submodule:

```bash
# Reset the submodule
git submodule deinit -f subnet-io-registry
git submodule update --init
```

#### API Generation Issues

If the API generation fails:

1. Ensure Python dependencies are installed:
   ```bash
   cd subnet-io-registry/docs
   pip install -r requirements.txt
   ```

2. Check if the OpenAPI spec was generated:
   ```bash
   ls -la subnet-io-registry/docs/openapi.json
   ```

#### npm Publishing Issues

If npm publishing fails:

1. Check if you're logged in to npm:
   ```bash
   npm whoami
   ```

2. Ensure your npm token has publish permissions:
   ```bash
   npm token list
   ```

3. Verify the package name is available:
   ```bash
   npm view @bitmind/bittensor-mcp
