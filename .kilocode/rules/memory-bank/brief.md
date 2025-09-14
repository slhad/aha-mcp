# Home Assistant MCP Server — Project Brief

## Infrastructure
- TypeScript project, runs with tsx
- Uses [`@modelcontextprotocol/sdk`](https://www.npmjs.com/package/@modelcontextprotocol/sdk) for MCP server
- Integrates [`home-assistant-js-websocket`](https://github.com/home-assistant/home-assistant-js-websocket) for Home Assistant API
- Dockerfile and docker-compose for containerization
- Unit tests with Vitest
- Multiple transport options: stdio (default), SSE, and streamablehttp for MCP communication

## Goals
- Expose Home Assistant entities and automations as MCP tools with comprehensive functionality
- Support CRUD operations for automations (get/create/update/delete)
- Enable service calls and entity state queries
- Manage entity registry, device registry, and configuration flows
- Provide Lovelace dashboard management capabilities
- Support multiple transport protocols for flexible deployment
- Provide robust, documented, and testable infrastructure

## Instructions
- Set `HASS_URL` and `HASS_ACCESS_TOKEN` environment variables before running
- Use `npm run dev` for development, `npm run test` for unit tests, `npm run test:short` for silent tests
- Use Docker or docker-compose for deployment
- Main entry: [`src/index.ts`](src/index.ts:1) — Contains MCP server creation and transport selection
- Home Assistant integration: [`src/hass/hassClient.ts`](src/hass/hassClient.ts:1), [`src/hass/types.ts`](src/hass/types.ts:1)
- Transport layer: [`src/mcpTransports.ts`](src/mcpTransports.ts:1) — SSE and HTTP transport implementations

## Important Stuff
- All MCP tools are registered in modular classes extending [`BaseMcp`](src/server/baseMcp.ts:1)
- Automations are managed via Home Assistant's websocket API and REST endpoints
- Comprehensive tool documentation automatically generated in [`tools.md`](tools.md:1)
- Multiple transport support (stdio, SSE, streamablehttp) via [`src/mcpTransports.ts`](src/mcpTransports.ts:1)
- Project is designed for extensibility, clarity, and production deployment