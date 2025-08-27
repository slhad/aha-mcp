// Lovelace MCP server extension for Home Assistant MCP
import { BaseMcp } from "./baseMcp";
import { z } from "zod";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DashboardConfigSchema } from "../hass/typesFront";

export class LovelaceMcp extends BaseMcp {
    register(): void {
        // Get Lovelace Config
        this.registerResourceOrTool(
            "get-lovelace-config",
            new ResourceTemplate("lovelace://config/{url_path}", { list: undefined }),
            {
                title: "Get Lovelace Config",
                description: "Fetch Lovelace dashboard config by url_path. The URL must contain a dash ('-') and must not contain spaces or special characters, except '_' and '-'",
                inputSchema: {
                    url_path: z.string().describe("The URL path of the Lovelace dashboard config to fetch, e.g., 'default-view' or 'dashboard-id'. The URL must contain a dash ('-') and must not contain spaces or special characters, except '_' and '-'"),
                    force: z.boolean().optional(),
                },
                mimeType: "application/json",
                outputSchema: undefined
            },
            async (_uri, { url_path, force }) => {
                await this.ensureConnection();
                try {
                    const config = await this.client.getLovelaceConfig(url_path, force);
                    return {
                        contents: [{
                            uri: `lovelace://config/${url_path}`,
                            type: "text",
                            text: JSON.stringify(config)
                        }]
                    };
                } catch (error: unknown) {
                    return {
                        isError: true,
                        contents: [{
                            type: "text",
                            text: `Failed to fetch Lovelace config for ${url_path}: ${error instanceof Error ? error.message : "Unknown error"}`,

                        }]
                    };
                }
            }
        );

        // Update Lovelace Config
        this.server.registerTool(
            "update-lovelace-config",
            {
                title: "Update Lovelace Config",
                description: "Update Lovelace dashboard config by url_path.",
                inputSchema: {
                    url_path: z.string().describe("The URL path of the Lovelace dashboard config to update"),
                    config: DashboardConfigSchema.describe("The updated Lovelace dashboard config"),
                }
            },
            async ({ url_path, config }) => {
                await this.ensureConnection();
                await this.client.updateLovelaceConfig(url_path, config);
                return {
                    content: [{
                        type: "text", text: "Lovelace config updated successfully", _meta: {}
                    }]
                };
            }
        );

        // List Lovelace Dashboards
        this.registerResourceOrTool(
            "list-lovelace-dashboards",
            "lovelace://dashboards/list",
            {
                title: "List Lovelace Dashboards",
                description: "List all Lovelace dashboards.",
                inputSchema: undefined,
                mimeType: "application/json",
                outputSchema: undefined
            },
            async () => {
                await this.ensureConnection();
                const dashboards = await this.client.listLovelaceDashboards();
                const contents = Array.isArray(dashboards)
                    ? dashboards.map((dashboard) => ({
                        uri: dashboard.url_path
                            ? `lovelace://config/${dashboard.url_path}`
                            : `lovelace://config/${dashboard.id || dashboard.title || "unknown"}`,
                        text: JSON.stringify(dashboard, null, 2),
                    }))
                    : [];
                return { contents };
            }
        );

        // Create Lovelace Dashboard
        this.server.registerTool(
            "create-lovelace-dashboard",
            {
                title: "Create Lovelace Dashboard",
                description: "Create a new Lovelace dashboard.",
                inputSchema: {
                    title: z.string(),
                    url_path: z.string().describe("The URL must contain a dash ('-') and must not contain spaces or special characters, except '_' and '-'"),
                    require_admin: z.boolean().optional(),
                    show_in_sidebar: z.boolean().optional(),
                },
            },
            async ({ title, url_path, require_admin, show_in_sidebar }) => {
                await this.ensureConnection();
                await this.client.createLovelaceDashboard(
                    title,
                    url_path,
                    require_admin,
                    show_in_sidebar
                );
                return { content: [{ type: "text", text: "Lovelace dashboard created successfully", _meta: {} }] };
            }
        );

        // Delete Lovelace Dashboard
        this.server.registerTool(
            "delete-lovelace-dashboard",
            {
                title: "Delete Lovelace Dashboard",
                description: "Delete a Lovelace dashboard by dashboard_id.",
                inputSchema: {
                    dashboard_id: z.string(),
                },
            },
            async ({ dashboard_id }) => {
                await this.ensureConnection();
                await this.client.deleteLovelaceDashboard(dashboard_id);
                return { content: [{ type: "text", text: "Lovelace dashboard deleted successfully", _meta: {} }] };
            }
        );

        // Get Lovelace Resources
        this.registerResourceOrTool(
            "get-lovelace-resources",
            "lovelace://resources",
            {
                title: "Get Lovelace Resources",
                description: "Fetch Lovelace resources.",
                inputSchema: undefined,
                mimeType: "application/json",
                outputSchema: undefined
            },
            async () => {
                await this.ensureConnection();
                const resources = await this.client.getLovelaceResources();
                return {
                    contents: [{
                        uri: "lovelace://resources",
                        type: "text",
                        text: JSON.stringify(resources)
                    }]
                };
            }
        );
    }
}