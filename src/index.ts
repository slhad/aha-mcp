
import { HomeAssistantMCPServer } from "./server/homeAssistantMcpServer.js";
import { HASSConfig } from "./hass/types.js";
import { startStreamableHttpServer, startSseServer } from "./mcpTransports.js";

const config: HASSConfig = {
    url: process.env.HASS_URL || "ws://localhost:8123",
    accessToken: process.env.HASS_ACCESS_TOKEN || "",
    debugMode: process.env.DEBUG === "true",
    RESOURCES_TO_TOOLS: process.env.RESOURCES_TO_TOOLS === "true",
    LIMIT_RESOURCES: process.env.LIMIT_RESOURCES ? parseInt(process.env.LIMIT_RESOURCES) : undefined,
    NO_LONG_INPUT_TYPES: process.env.NO_LONG_INPUT_TYPES === "true",
    NO_LONG_OUTPUT_TYPES: process.env.NO_LONG_OUTPUT_TYPES === "true",
    transport: process.env.TRANSPORT as "stdio" | "sse" | "streamablehttp" | undefined,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000
};

if (!config.accessToken && process.env.INSPECT !== "true") {
    console.error("Missing HASS_ACCESS_TOKEN");
    process.exit(1);
}

if (!config.transport || config.transport === "stdio") {
    new HomeAssistantMCPServer(config).start().catch((error) => {
        console.error("Server error:", error);
        process.exit(1);
    });
} else if (config.transport === "streamablehttp") {
    startStreamableHttpServer(config).catch((error) => {
        console.error("Streamable HTTP server error:", error);
        process.exit(1);
    });
} else if (config.transport === "sse") {
    startSseServer(config).catch((error) => {
        console.error("SSE server error:", error);
        process.exit(1);
    });
}
