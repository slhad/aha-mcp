# Tech

- TypeScript, tsx, Vitest for unit tests.
- MCP SDK (@modelcontextprotocol/sdk), home-assistant-js-websocket, zod-to-json-schema, express, cors.
- Node.js >=18, Docker, Docker Compose.
- Environment variables: HASS_URL, HASS_ACCESS_TOKEN, DEBUG, TRANSPORT, PORT.
- Additional transport options: stdio (default), sse, streamablehttp.
- Scripts: start, test, test:short, check, format, docker, podman, generate-docs.
- Use `npm run test:short` for running unit tests silently.
- Unit tests support dual-mode: mock and real Home Assistant instance. Test mode is determined automatically: if `tests/hass-real-config.ts` exists, tests use real credentials (file is ignored from git/docker); otherwise, tests run in mock mode. `tests/hass-real-config.example.ts` provides a template for other builders.
- ESLint for code formatting and linting (replaces Prettier), with TypeScript parser. Format script in package.json: "format": "eslint --fix .".
- MCP Inspector integration for tool extraction and documentation generation.