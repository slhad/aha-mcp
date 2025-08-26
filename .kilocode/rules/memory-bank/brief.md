# Home Assistant MCP Server — Project Brief

## Infrastructure
- TypeScript project, runs with tsx
- Uses [`@modelcontextprotocol/sdk`](https://www.npmjs.com/package/@modelcontextprotocol/sdk) for MCP server
- Integrates [`home-assistant-js-websocket`](https://github.com/home-assistant/home-assistant-js-websocket) for Home Assistant API
- Dockerfile and docker-compose for containerization
- Unit tests with Vitest
- Stdio support for MCP communication

## Goals
- Expose Home Assistant entities and automations as MCP tools
- Support CRUD operations for automations (get/create/update/delete)
- Enable service calls and entity state queries
- Provide robust, documented, and testable infrastructure

## Instructions
- Set `HASS_URL` and `HASS_ACCESS_TOKEN` environment variables before running
- Use `npm run dev` for development, `npm run test` for unit tests
- Use Docker or docker-compose for deployment
- Main entry: [`src/index.ts`](src/index.ts:1)
- MCP server: [`src/server/homeAssistantMcpServer.ts`](src/server/homeAssistantMcpServer.ts:1)
- Home Assistant integration: [`src/hass/hassClient.ts`](src/hass/hassClient.ts:1), [`src/hass/types.ts`](src/hass/types.ts:1)

## Important Stuff
- All MCP tools are registered in the MCP server class
- Automations are managed via Home Assistant's websocket API
- Documentation is in [`README.md`](README.md:1)
- Project is designed for extensibility and clarity