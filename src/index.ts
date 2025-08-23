import { HomeAssistantMCPServer } from "./server/homeAssistantMcpServer.js";
import { HASSConfig } from "./hass/types.js";

const config: HASSConfig = {
    url: process.env.HASS_URL || "ws://localhost:8123",
    accessToken: process.env.HASS_ACCESS_TOKEN || "",
    debugMode: process.env.DEBUG === "true",
    RESOURCES_TO_TOOLS: process.env.RESOURCES_TO_TOOLS === "true",
    LIMIT_RESOURCES: process.env.LIMIT_RESOURCES ? parseInt(process.env.LIMIT_RESOURCES) : undefined,
    NO_LONG_INPUT_TYPES: process.env.NO_LONG_INPUT_TYPES === "true",
    NO_LONG_OUTPUT_TYPES: process.env.NO_LONG_OUTPUT_TYPES === "true",
};

if (!config.accessToken && process.env.INSPECT !== "true") {
    console.error("Missing HASS_ACCESS_TOKEN");
    process.exit(1);
}

new HomeAssistantMCPServer(config).start().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
