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

### Automated GitHub Actions Workflow

This project uses GitHub Actions for automated releases. The release process is now fully automated with two workflows:

1. **Version Check Workflow**: Triggered on every push to the main branch
   - Checks if the version in package.json has changed
   - If changed, automatically creates and pushes a tag matching the version

2. **Release Workflow**: Triggered when a tag starting with 'v' is pushed
   - Builds the project and publishes it to npm
   - Creates a GitHub Release with automatically generated release notes

#### Required GitHub Secrets

For the GitHub Actions workflows to work, you need to set up the following secret in your GitHub repository:

- `NPM_TOKEN`: An npm access token with publish permissions

**Token Type**: You can use either a classic npm token or a granular access token:
- **Classic Token**: Simpler to set up but has broader permissions
- **Granular Token**: More secure as you can limit permissions to only what's needed
  - If using a granular token, ensure it has the following permissions:
    - Read and write access to packages
    - Scope limited to the specific package or organization

To add this secret:
1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Your npm access token

To create an npm token:
1. Go to npmjs.com and log in
2. Click on your profile icon > "Access Tokens"
3. Choose "Generate New Token" (classic or granular)
4. For granular tokens, select the appropriate permissions
5. Copy the token immediately (it won't be shown again)

#### Creating a Release

With the automated workflow, creating a release is now much simpler:

1. Update the version in package.json
2. Commit and push your changes to the main branch
3. The Version Check workflow will automatically:
   - Detect the version change
   - Create and push a tag matching the new version
4. The Release workflow will then:
   - Check out the code with submodules
   - Set up Node.js 22.x and Python
   - Install dependencies
   - Generate the OpenAPI spec and API client
   - Build the project
   - Create a GitHub Release with automatically generated release notes
   - Publish the package to npm

**Important Note**: This automated process works for changes pushed to the main branch or the mcp-release-workflow-test branch.

#### Re-running a Failed Release

If the release workflow fails for any reason, you can re-run it without having to increment the version number:

1. Go to the GitHub Actions tab in your repository
2. Select the "Version Check and Tag" workflow
3. Click "Run workflow" button in the top right corner
4. Select the branch containing the version you want to release
5. Click "Run workflow"

This will create a new tag with the current version in package.json, even if it hasn't changed since the last commit. The tag creation process will automatically delete any existing tag with the same version before creating a new one.

#### Manual Release (Alternative)

If you need to manually trigger a release, you can still create and push a tag:
```bash
git tag v1.0.0
git push origin v1.0.0
```

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
