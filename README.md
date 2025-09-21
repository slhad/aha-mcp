# AHA Model Context Protocol (MCP) Server

## Quick install links
**STDIO**  

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_AHA--MCP-0098FF?style=for-the-badge&logo=visualstudiocode&logoColor=ffffff)](https://insiders.vscode.dev/redirect/mcp/install?name=aha-mcp&config=%7B%22type%22%3A%20%22stdio%22%2C%22command%22%3A%22docker%22%2C%22args%22%3A%5B%22run%22%2C%22--pull%22%2C%22always%22%2C%22-i%22%2C%22--rm%22%2C%22-e%22%2C%22TRANSPORT%3Dstdio%22%2C%22-e%22%2C%22RESOURCES_TO_TOOLS%3Dtrue%22%2C%22-e%22%2C%22HASS_URL%22%2C%22-e%22%2C%22HASS_ACCESS_TOKEN%22%2C%22ghcr.io%2Fslhad%2Faha-mcp%3Alatest%22%5D%2C%22env%22%3A%7B%22HASS_ACCESS_TOKEN%22%3A%22%24%7Binput%3AHASS_ACCESS_TOKEN%7D%22%2C%22HASS_URL%22%3A%22%24%7Binput%3AHASS_URL%7D%22%7D%7D)

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=aha-mcp&config=eyJjb21tYW5kIjoiZG9ja2VyIHJ1biAtLXB1bGwgYWx3YXlzIC1pIC0tcm0gLWUgVFJBTlNQT1JUPXN0ZGlvIC1lIFJFU09VUkNFU19UT19UT09MUz10cnVlIC1lIEhBU1NfVVJMPWh0dHBzOi8vaGFfaW5zdGFuY2UgLWUgSEFTU19BQ0NFU1NfVE9LRU49aGFfbG9uZ19saXZlZF9hY2Nlc3NfdG9rZW4gZ2hjci5pby9zbGhhZC9haGEtbWNwOmxhdGVzdCJ9)

**Others**  
[![smithery badge](https://smithery.ai/badge/@slhad/aha-mcp)](https://smithery.ai/server/@slhad/aha-mcp)

Pretty useful to test it without IDE

## AHA stands for Another Home Assistant MCP Server


This repository implements a Model Context Protocol (MCP) server for Home Assistant, providing a bridge between Home Assistant and MCP clients.

With this server, you can:

- List and query Home Assistant entities (lights, sensors, switches, etc.)
- Retrieve and update the state of entities
- Call Home Assistant services (e.g., turn on/off devices)
- Manage automations: list, create, update, and validate automations
- Access and update the entity registry
- Integrate and update Lovelace dashboards
- Validate Home Assistant configuration
- Search for entities by prefix or regex
- Access entity sources and registry information

The server supports multiple transport methods:
- **STDIO**: Traditional MCP client communication (default)
- **Server-Sent Events (SSE)**: Web-based real-time communication
- **Streamable HTTP**: HTTP-based MCP communication for web integration

## Table of Contents

- [AHA Model Context Protocol (MCP) Server](#aha-model-context-protocol-mcp-server)
  - [Quick install links](#quick-install-links)
  - [AHA stands for Another Home Assistant MCP Server](#aha-stands-for-another-home-assistant-mcp-server)
  - [Table of Contents](#table-of-contents)
  - [Motivation](#motivation)
  - [Features](#features)
  - [Available Tools](#available-tools)
    - [Generating Tools Documentation](#generating-tools-documentation)
  - [Project Structure](#project-structure)
  - [Example: Running the MCP Server](#example-running-the-mcp-server)
    - [1. Run with STDIO Transport (Default)](#1-run-with-stdio-transport-default)
    - [2. Run with Server-Sent Events (SSE) Transport](#2-run-with-server-sent-events-sse-transport)
    - [3. Run with Streamable HTTP Transport](#3-run-with-streamable-http-transport)
    - [4. Quick SSE Server Startup](#4-quick-sse-server-startup)
    - [5. Run with Podman/Docker - STDIO Transport](#5-run-with-podmandocker---stdio-transport)
    - [6. Run with Podman/Docker - HTTP/SSE Server](#6-run-with-podmandocker---httpsse-server)
    - [Environment Variables](#environment-variables)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Server](#running-the-server)
    - [Running Tests](#running-tests)
    - [Docker Usage](#docker-usage)
  - [Contributing](#contributing)
  - [License](#license)

## Motivation

While exploring existing MCP server implementations for Home Assistant, I found that:

- Many repositories did not provide a buildable or working Docker image, making deployment difficult or impossible.
- Several projects did not actually implement the features or protocol described in their own README files.
- Some solutions were outdated, unmaintained, or lacked clear documentation and test coverage.


This project aims to address these gaps by providing a reliable and fully functional MCP server with straightforward Docker support and a focus on real-world usability.

> **Special Mention:**
> Most of the documentation in this project is generated or assisted by AI. As this is a side project (even though I work as a developer), I focus on building fun and working features, and prefer to review and accept generated documentation if it's good enough, rather than writing everything by hand.

## Features
- Home Assistant client integration
- Entity registry and management
- Automation and configuration MCP endpoints
- Lovelace dashboard support
- **Multiple transport options**: stdio, Server-Sent Events (SSE), and Streamable HTTP
- TypeScript codebase with Vitest for testing
- Docker support for easy deployment

## Available Tools

This MCP server provides **comprehensive tools** for interacting with Home Assistant, including:

- **Automation Management**: Create, update, delete, and trace automations
- **Entity Operations**: Query and manipulate Home Assistant entities
- **Service Calls**: Execute Home Assistant services
- **Configuration**: Validate and manage Home Assistant configuration
- **Registry Access**: Access entity and device registries
- **Config Entry Flow Helpers**: Create and manage Home Assistant integration flows

> **⚠️ TOKEN COST WARNING**
>
> **Important:** Each tool definition consumes tokens in your LLM context, even if unused! Some tools (like `update-lovelace-config`) can cost 4,000+ tokens alone. Consider excluding unnecessary tools to minimize token consumption and maximize conversation efficiency.

For a complete list of all available tools with detailed descriptions and parameters, see the **[Tools Documentation](tools.md)**.

### Generating Tools Documentation

The tools documentation is automatically generated from the MCP server:

```sh
npm run generate-docs
```

This command will:
1. Extract all available tools from the MCP server using the inspector
2. Generate a comprehensive markdown documentation file (`tools.md`)
3. Clean up temporary files

**Note:** The tools documentation shows the server currently provides **39 tools** for comprehensive Home Assistant integration.

## Project Structure
- `src/` - Main source code
  - `hass/` - Home Assistant client and helpers
  - `server/` - MCP server implementations
  - `mcpTransports.ts` - Transport layer implementations (HTTP, SSE)
- `tests/` - Test files and Home Assistant config examples
- `scripts/` - Build and documentation generation scripts
- `Dockerfile` - Containerization support
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vitest.config.ts` - Vitest test runner configuration



## Example: Running the MCP Server

The MCP server supports multiple transport methods. You can run it using the same command and argument structure as in your `mcp_settings.json`.

### 1. Run with STDIO Transport (Default)

For traditional MCP client integration via stdio (server is launched by MCP client):

```jsonc
{
  "type": "stdio",
  "command": "tsx",
  "args": [
    "c:/dev/git/aha-mcp/src/index.ts"
  ],
  "env": {
    "LIMIT_RESOURCES": "-1",
    "RESOURCES_TO_TOOLS": "true",
    "DEBUG": "true",
    "HASS_URL": "https://your-home-assistant.local:8123",
    "HASS_ACCESS_TOKEN": "<your_token_here>"
  }
}
```

### 2. Run with Server-Sent Events (SSE) Transport

For SSE-based MCP communication, you need to run the server separately and then configure the MCP client to connect via URL.

**Step 1: Start the SSE server**
```bash
# Start the server with SSE transport using npm script
HASS_URL=https://your-home-assistant.local:8123 HASS_ACCESS_TOKEN=<your_token_here> npm run start:local:sse

# Or with additional configuration
RESOURCES_TO_TOOLS=true DEBUG=true HASS_URL=https://your-home-assistant.local:8123 HASS_ACCESS_TOKEN=<your_token_here> npm run start:local:sse
```

**Step 2: Configure MCP client to connect via URL**
```jsonc
{
  "url": "http://localhost:8081/sse",
  "alwaysAllow": [
    // your allowed tools here
  ]
}
```

### 3. Run with Streamable HTTP Transport

For HTTP-based MCP communication, you need to run the server separately and then configure the MCP client to connect via URL.

**Step 1: Start the HTTP server**
```bash
# Start the server with streamable HTTP transport using npm script
HASS_URL=https://your-home-assistant.local:8123 HASS_ACCESS_TOKEN=<your_token_here> npm run start:local:http
```

**Step 2: Configure MCP client to connect via URL**
```jsonc
{
  "url": "http://localhost:8081/mcp",
  "alwaysAllow": [
    // your allowed tools here
  ]
}
```

### 4. Quick SSE Server Startup

Start the SSE server directly with npm scripts:

```bash
# Set your Home Assistant credentials first
export HASS_URL=https://your-home-assistant.local:8123
export HASS_ACCESS_TOKEN=<your_token_here>

# Start SSE server with RESOURCES_TO_TOOLS enabled
RESOURCES_TO_TOOLS=true DEBUG=true npm run start:local:sse
```

Then configure your MCP client with:
```jsonc
{
  "url": "http://localhost:3000/sse"
}
```

### 5. Run with Podman/Docker - STDIO Transport

For STDIO transport with containers:

```jsonc
{
  "type": "stdio",
  "command": "podman",
  "args": [
    "run",
    "-i",
    "--rm",
    "-e",
    "HASS_URL=https://your-home-assistant.local:8123",
    "-e",
    "HASS_ACCESS_TOKEN=<your_token_here>",
    "ghcr.io/slhad/aha-mcp:latest"
  ]
}
```

### 6. Run with Podman/Docker - HTTP/SSE Server

For HTTP/SSE transports, run the server separately in a container:

**Step 1: Start the server container**
```bash
# For SSE transport
podman run -p 8081:8081 -e HASS_URL=https://your-home-assistant.local:8123 -e HASS_ACCESS_TOKEN=<your_token_here> ghcr.io/slhad/aha-mcp -- sse

# For HTTP transport  
podman run -p 8081:8081 -e HASS_URL=https://your-home-assistant.local:8123 -e HASS_ACCESS_TOKEN=<your_token_here> ghcr.io/slhad/aha-mcp -- http
```

**Step 2: Configure MCP client**
```jsonc
{
  "url": "http://localhost:3000/sse",  // for SSE
  // or
  "url": "http://localhost:3000/mcp"   // for HTTP
}
```

Replace `<your_token_here>` with your actual Home Assistant access token.

### Environment Variables

The following environment variables can be set to configure the MCP server:

- `HASS_URL` (required): The URL of your Home Assistant instance. Example: `https://your-home-assistant.local:8123` (default in code: `http://localhost:8123`)
- `HASS_ACCESS_TOKEN` (required): Long-lived access token for Home Assistant. The server will not start without this.
- `DEBUG`: Set to `true` to enable debug logging. Default: `false`.
- `RESOURCES_TO_TOOLS`: Set to `true` to enable mapping resources to tools. Default: `false`.
  - **Detailed explanation:**
    When enabled, this option exposes Home Assistant resources (such as entities, automations, and services) as individual tools for MCP clients. This is especially useful for clients or agents that can only interact with the server via tool-based interfaces, rather than through generic resource queries. It allows such clients to discover and use Home Assistant features as discrete, callable tools, improving compatibility and usability for tool-limited environments.
- `LIMIT_RESOURCES`: Set to a number to limit the number of resources returned by the server. Default: unlimited.

**Note:** The server transport method is now controlled by command line arguments (`sse` or `http`) rather than environment variables.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Docker (optional, for containerized deployment)

### Installation
```sh
npm install
```

### Running the Server

**For STDIO transport (launched by MCP client):**
```sh
# Set environment variables and run with npm
npm start
```

**For HTTP/SSE transports (run server separately):**
```sh
# Run SSE server on port 8081
npm run start:local:sse

# Run HTTP server on port 8081:8081
npm run start:local:http

# Quick SSE server startup with environment variables
RESOURCES_TO_TOOLS=true DEBUG=true npm run start:local:sse
```

Then configure your MCP client to connect via URL:
- SSE: `"url": "http://localhost:3000/sse"`
- HTTP: `"url": "http://localhost:8080/mcp"`


### Running Tests
```sh
npm run test:short
```

> **Note:**
> The unit tests currently run against a real Home Assistant instance and are not mocked yet. This means tests require a live Home Assistant server and valid credentials to execute successfully.

### Docker Usage
Build and run the server in a Docker container:

```sh
# Build the container
npm run docker
```

then follow :

 - [Stdio](#5-run-with-podmandocker---stdio-transport)
 - [HTTP/SSE](#6-run-with-podmandocker---httpsse-server)
  
For HTTP/SSE modes, then configure your MCP client with the appropriate URL:
- SSE: `"url": "http://localhost:3000/sse"`
- HTTP: `"url": "http://localhost:8081/mcp"`

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
See [LICENSE](LICENSE) for details.
