import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { version } from "../package.json"
import { HASSConfig, HASSConfigSchema } from "./hass/types";
import { BaseMcp } from "./server/baseMcp";
import { AutomationMcp } from "./server/automationMcp";
import { ConfigMcp } from "./server/configMcp";
import { EntityRegistry } from "./server/entityRegistry";
import { Entities } from "./server/entites";
import { LovelaceMcp } from "./server/lovelaceMcp";
import { HASSClient } from "./hass/hassClient";
import { startSSEServer } from "./mcpTransports";

export const configSchema = HASSConfigSchema;
export default function createServer({
    config
}: {
    config: HASSConfig;
}) {

    if (config.debugMode) {
        const obfuscatedConfig = JSON.parse(JSON.stringify(config));
        obfuscatedConfig.accessToken = "***";
        console.error("Initializing Home Assistant MCP Server with config:", obfuscatedConfig);
    }

    const server = new McpServer({
        name: "Another Home Assistant MCP Server",
        description:
            "A server for interacting with Home Assistant via Model Context Protocol",
        version
    });

    const mcps: BaseMcp[] = []
    const ensureConnection = async () => {
        if (!client.ref) {
            client.ref = await HASSClient.create(config);
        }
    }

    const client = { ref: undefined as unknown as HASSClient, ensureConnection };

    const configMcp = {
        DEBUG: config.debugMode ?? false,
        RESOURCES_TO_TOOLS: config.RESOURCES_TO_TOOLS ?? false,
        LIMIT_RESOURCES: typeof config.LIMIT_RESOURCES === "number" ? config.LIMIT_RESOURCES : -1,
    };
    mcps.push(new AutomationMcp(server, client, configMcp));
    mcps.push(new ConfigMcp(server, client, configMcp));
    mcps.push(new EntityRegistry(server, client, configMcp));
    mcps.push(new Entities(server, client, configMcp));
    mcps.push(new LovelaceMcp(server, client, configMcp));

    mcps.forEach((mcp) => mcp.register());

    return server.server;
}

async function main() {

    const config: HASSConfig = {
        url: process.env.HASS_URL || "http://localhost:8123",
        accessToken: process.env.HASS_ACCESS_TOKEN || "",
        debugMode: process.env.DEBUG === "true",
        RESOURCES_TO_TOOLS: process.env.RESOURCES_TO_TOOLS === "true",
        LIMIT_RESOURCES: process.env.LIMIT_RESOURCES ? parseInt(process.env.LIMIT_RESOURCES) : -1
    } as HASSConfig;

    const server = createServer({ config });

    switch (true) {
        case process.argv.includes("http"): {
            await startStreamableHttpServer(server);
            break;
        }
        case process.argv.includes("sse"): {
            await startSSEServer(server);
            break;
        }
        default: {
            const transport = new StdioServerTransport();
            await server.connect(transport);
            console.error("MCP Server running in stdio mode");
        }
    }
}

const smithery = process.argv.includes(".smithery");
if (!smithery) {
    main().catch((error) => {
        console.error("Server error:", error);
        process.exit(1);
    });
}