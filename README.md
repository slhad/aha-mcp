# AHA Model Context Protocol (MCP) Server

**AHA stands for Another Home Assistant MCP Server.**


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

## Table of Contents

- [AHA Model Context Protocol (MCP) Server](#aha-model-context-protocol-mcp-server)
  - [Table of Contents](#table-of-contents)
  - [Motivation](#motivation)
  - [Features](#features)
  - [Available Tools](#available-tools)
    - [Generating Tools Documentation](#generating-tools-documentation)
  - [Project Structure](#project-structure)
  - [Example: Running the MCP Server](#example-running-the-mcp-server)
    - [1. Run with Node.js (with tsx in global path) (most likely for development)](#1-run-with-nodejs-with-tsx-in-global-path-most-likely-for-development)
    - [2. Run with Podman (drop-in docker remplacement)](#2-run-with-podman-drop-in-docker-remplacement)
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
- TypeScript codebase with Vitest for testing
- Docker support for easy deployment

## Available Tools

This MCP server provides **comprehensive tools** for interacting with Home Assistant, including:

- **Automation Management**: Create, update, delete, and trace automations
- **Entity Operations**: Query and manipulate Home Assistant entities
- **Service Calls**: Execute Home Assistant services
- **Configuration**: Validate and manage Home Assistant configuration
- **Registry Access**: Access entity and device registries

For a complete list of all available tools with detailed descriptions and parameters, see the **[Tools Documentation](tools.md)**.

### Generating Tools Documentation

The tools documentation is automatically generated from the MCP server:

```sh
npm run generate-docs
```

This command will:
1. Extract all available tools from the MCP server
2. Generate a comprehensive markdown documentation file (`tools.md`)
3. Clean up temporary files

## Project Structure
- `src/` - Main source code
  - `hass/` - Home Assistant client and helpers
  - `server/` - MCP server implementations
- `tests/` - Test files and Home Assistant config examples
- `Dockerfile` - Containerization support
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vitest.config.ts` - Vitest test runner configuration



## Example: Running the MCP Server

You can run the MCP server using the same command and argument structure as in your `mcp_settings.json`.

### 1. Run with Node.js (with tsx in global path) (most likely for development)

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
    "NO_LONG_INPUT_TYPES": "true",
    "NO_LONG_OUTPUT_TYPES": "true",
    "DEBUG": "true",
    "HASS_URL": "https://your-home-assistant.local:8123",
    "HASS_ACCESS_TOKEN": "<your_token_here>"
  }
}
```


### 2. Run with Podman (drop-in docker remplacement)

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
    "ghcr.io/slhad/aha-mcp"
  ]
}
```



Replace `<your_token_here>` with your actual Home Assistant access token.

### Environment Variables

The following environment variables can be set to configure the MCP server:

- `HASS_URL` (required): The URL of your Home Assistant instance. Example: `https://your-home-assistant.local:8123` (default in code: `ws://localhost:8123`)
- `HASS_ACCESS_TOKEN` (required): Long-lived access token for Home Assistant. The server will not start without this.
- `DEBUG`: Set to `true` to enable debug logging. Default: `false`.
- `RESOURCES_TO_TOOLS`: Set to `true` to enable mapping resources to tools. Default: `false`.
  - **Detailed explanation:**
    When enabled, this option exposes Home Assistant resources (such as entities, automations, and services) as individual tools for MCP clients. This is especially useful for clients or agents that can only interact with the server via tool-based interfaces, rather than through generic resource queries. It allows such clients to discover and use Home Assistant features as discrete, callable tools, improving compatibility and usability for tool-limited environments.
- `LIMIT_RESOURCES`: Set to a number to limit the number of resources returned by the server. Default: unlimited.
- `NO_LONG_INPUT_TYPES`: Set to `true` to disable long input types. Default: `false`.
- `NO_LONG_OUTPUT_TYPES`: Set to `true` to disable long output types. Default: `false`.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Docker (optional, for containerized deployment)

### Installation
```sh
npm install
```

### Running the Server
```sh
# export env varbles before running it
npm start
```


### Running Tests
```sh
npm run test:short
```

> **Note:**
> The unit tests currently run against a real Home Assistant instance and are not mocked yet. This means tests require a live Home Assistant server and valid credentials to execute successfully.

### Docker Usage
Build and run the server in a Docker container:
```sh
npm run docker
docker run -p 3000:3000 aha-mcp
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
See [LICENSE](LICENSE) for details.
