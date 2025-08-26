import { z } from "zod";
import { HassStatusSchema, ValidateConfigSchema } from "../hass/types";
import { BaseMcp } from "./baseMcp";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

export class ConfigMcp extends BaseMcp {

    register() {
        this.registerResourceOrTool(
            "get-status",
            "config://status",
            {
                title: "Get Home Assistant connection status",
                description: "Get Home Assistant connection status",
                inputSchema: {},
                mimeType: "application/json",
                outputSchema: HassStatusSchema
            },
            async () => {
                await this.ensureConnection();
                const states = await this.client!.getStates();
                return {
                    contents: [
                        {
                            uri: "config://status",
                            text: JSON.stringify({
                                connected: true,
                                entityCount: states.length,
                            }),
                            mimeType: "application/json",
                            _meta: {},
                        },
                    ],
                };
            }
        );

        this.server.registerTool(
            "validate-config",
            {
                title: "Validate triggers, conditions and actions for any automation change",
                description: "Validate triggers, conditions and actions configurations as if part of an automation. Any changes to automation should be checked with this tool",
                inputSchema: { config: ValidateConfigSchema.passthrough() },
            },
            async ({ config }) => {
                await this.ensureConnection();
                try {
                    const result = await this.client!.validateConfig(config);
                    return { content: [{ type: "text", text: JSON.stringify(result), _meta: {} }] };
                    // @ts-ignore
                } catch (err: any) {
                    if (this.options.DEBUG) {
                        console.error("Config validation error:", err);
                    }
                    return {
                        content: [{
                            type: "text",
                            // @ts-ignore
                            text: `Config validation failed: ${err.code} : ${err.message}`,
                            _meta: { error: true }
                        }]
                    };
                }
            }
        );

        this.server.registerTool(
            "call-service",
            {
                title: "Call a Home Assistant service",
                description: "Call a Home Assistant service",
                inputSchema: {
                    domain: z.string().describe("Service domain (e.g., light, switch)"),
                    service: z.string().describe("Service name"),
                    data: z.record(z.string(), z.unknown()).optional(),
                },
            },
            async (args: Record<string, unknown>) => {
                await this.ensureConnection();
                const domain = args.domain as string;
                const service = args.service as string;
                const data = args.data as Record<string, unknown> | undefined;
                await this.client!.callService(domain, service, data);
                return {
                    content: [{ type: "text", text: JSON.stringify({ success: true }), _meta: {} }],
                };
            }
        );

        this.registerResourceOrTool(
            "get-manifest",
            new ResourceTemplate("config://manifest/{integration}", { list: undefined }),
            {
                title: "Get Home Assistant integration manifest",
                description: "Get the manifest of a Home Assistant integration",
                inputSchema: { integration: z.string().describe("Integration name, e.g. 'light'") },
                mimeType: "application/json",
                outputSchema: undefined
            },
            async (uri: URL, { integration }) => {
                await this.ensureConnection();
                const manifest = await this.client!.getManifest(integration as string);
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify(manifest),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );
    }
}