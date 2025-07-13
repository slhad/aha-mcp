import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { HASSClient } from "../hass/hassClient";
import { ConfigMcpDef } from "../hass/types";

export abstract class BaseMcp {
    public server: McpServer;
    public refClient: { ref: HASSClient, ensureConnection: () => Promise<void> };
    public options: ConfigMcpDef;

    abstract register(): void;

    constructor(
        server: McpServer,
        refClient: { ref: HASSClient, ensureConnection: () => Promise<void> },
        options: ConfigMcpDef
    ) {
        this.server = server;
        this.refClient = refClient;
        this.options = options;
    }

    ensureConnection = () => this.refClient.ensureConnection();

    get client() {
        return this.refClient.ref;
    }

    registerResourceOrTool(
        name: string,
        templateOrUri: string | ResourceTemplate,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: (...args: any[]) => Promise<any>
    ) {
        if (this.options.LIMIT_RESOURCES === 0) {
            console.error(`Warning: Limit reached for resources, cannot register ${name}`);
            return;
        } else if (this.options.LIMIT_RESOURCES > 0) {
            this.options.LIMIT_RESOURCES--;
            if (this.options.LIMIT_RESOURCES === 1) {
                console.error(`Warning: Limit reached for resources, this is the last one registered : ${name}`);
            }
        }

        if (this.options.RESOURCES_TO_TOOLS) {
            // Translate resource registration to tool registration
            this.server.registerTool(
                name,
                {
                    title: options.title,
                    description: options.description,
                    inputSchema: options.inputSchema,
                    outputSchema: options.outputSchema?.shape ? options.outputSchema.shape : undefined,
                },
                async (args: Record<string, unknown>) => {
                    // If template, extract params from args and call handler
                    if (typeof templateOrUri === "string") {
                        const result = await handler(undefined, args);
                        if (this.options.DEBUG) {
                            console.error(`Raw resource ${name}:`, JSON.stringify(result));
                        }
                        const content = result.contents[0];
                        const noContent = !content.text;
                        if (noContent) {
                            content.text = "No data found";
                        }
                        content.type = "text";
                        delete content.uri;
                        delete content.mimeType;
                        const final = {
                            content: [content]
                        };
                        if (this.options.DEBUG) {
                            console.error(`Resource to Tool ${name}:`, JSON.stringify(final));
                        }
                        return final;
                    } else {
                        // ResourceTemplate: build a fake URI for compatibility
                        const uri = new URL("http://dummy/" + name);
                        const result = await handler(uri, args);
                        if (this.options.DEBUG) {
                            console.error(`Raw resource ${name}:`, JSON.stringify(result));
                        }
                        const content = result.contents[0];
                        const noContent = !content.text;
                        if (noContent) {
                            content.text = "No data found";
                        }
                        content.type = "text";
                        delete content.uri;
                        delete content.mimeType;
                        const final = {
                            content: [content]
                        };
                        if (this.options.DEBUG) {
                            console.error(`Resource to Tool ${name}:`, JSON.stringify(final));
                        }
                        return final;
                    }
                }
            );
        } else {
            this.server.registerResource(name, templateOrUri as string, options, handler);
        }
    }
}