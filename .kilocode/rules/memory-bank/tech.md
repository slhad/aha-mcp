# Tech

- TypeScript, tsx, Vitest for unit tests.
- MCP SDK, home-assistant-js-websocket, node-fetch, zod.
- Node.js >=18, Docker, Docker Compose.
- Environment variables: HASS_URL, HASS_ACCESS_TOKEN.
- Scripts for dev, build, test, Docker.
- Use `npm run test:short` for running unit tests.
- Unit tests support dual-mode: mock and real Home Assistant instance. Test mode is determined automatically: if `tests/hass-real-config.ts` exists, tests use real credentials (file is ignored from git/docker); otherwise, tests run in mock mode. `tests/hass-real-config.example.ts` provides a template for other builders.
- Prettier for code formatting (dev dependency), configured for double quotes and no trailing commas. Format script in package.json: "format": "prettier --write \"src/**/*.ts\" \"tests/**/*.ts\"".