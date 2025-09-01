import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { HASSClient } from "../hass/hassClient.js";
import {
    HASSConfig
} from "../hass/types.js";
import { AutomationMcp } from "./automationMcp.js";
import { BaseMcp } from "./baseMcp.js";
import { ConfigMcp } from "./configMcp.js";
import { Entities } from "./entites.js";
import { EntityRegistry } from "./entityRegistry.js";
import { LovelaceMcp } from "./lovelaceMcp.js";

export class HomeAssistantMCPServer {
    private client: { ref: HASSClient, ensureConnection: () => Promise<void> };
    private server: McpServer;
    private mcps: BaseMcp[] = [];

    getServer() {
        return this.server;
    }

    constructor(private config: HASSConfig) {

        // That's for the late initialization, yes it's ugly by ref
        this.client = { ref: undefined as unknown as HASSClient, ensureConnection: this.ensureConnection.bind(this) };

        if (this.config.debugMode) {
            const obfuscatedConfig = JSON.parse(JSON.stringify(this.config));
            obfuscatedConfig.accessToken = "***";
            console.error("Initializing Home Assistant MCP Server with config:", obfuscatedConfig);
        }

        this.server = new McpServer({
            name: "Another Home Assistant MCP Server",
            description:
                "A server for interacting with Home Assistant via Model Context Protocol",
            version: "1.0.0",
        }, {
            "instructions": "This server provides access to Home Assistant functionalities through Model Context Protocol. You can list entities, call services, manage automations, and more.",
        });
        const configMcp = {
            DEBUG: this.config.debugMode ?? false,
            RESOURCES_TO_TOOLS: this.config.RESOURCES_TO_TOOLS ?? false,
            LIMIT_RESOURCES: typeof this.config.LIMIT_RESOURCES === "number" ? this.config.LIMIT_RESOURCES : -1,
        };
        this.mcps.push(new AutomationMcp(this.server, this.client, configMcp));
        this.mcps.push(new ConfigMcp(this.server, this.client, configMcp));
        this.mcps.push(new EntityRegistry(this.server, this.client, configMcp));
        this.mcps.push(new Entities(this.server, this.client, configMcp));
        this.mcps.push(new LovelaceMcp(this.server, this.client, configMcp));

        this.mcps.forEach((mcp) => mcp.register());
    }

    private async ensureConnection() {
        if (!this.client.ref) {
            this.client.ref = await HASSClient.create(this.config);
        }
    }

    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        if (this.config.debugMode) {
            console.error("Home Assistant MCP Server started");
        }
    }
    public async _invokeTool(toolName: string, args: Record<string, unknown>) {
        // @ts-expect-error Yes it's ugly, but we need to access the private _registeredTools for unit testing
        return await this.server._registeredTools[toolName].callback(args);
    }

}
