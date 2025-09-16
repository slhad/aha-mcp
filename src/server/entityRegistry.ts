import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DeviceIdResponseSchema, EntityRegistrySchema } from "../hass/types";
import { BaseMcp } from "./baseMcp";

export class EntityRegistry extends BaseMcp {

    register() {
        this.registerResourceOrTool(
            "get-entity-registry-by-entity-id",
            new ResourceTemplate("entity://registry/by-entity-id/{entityId}", { list: undefined }),
            {
                title: "Get entity registry by entity_id",
                description: "Get registry info for a specific entity_id",
                inputSchema: { entityId: z.string().describe("Entity ID, e.g. 'sensor.temperature'") },
                mimeType: "application/json",
                outputSchema: { registry: EntityRegistrySchema }
            },
            async (uri: URL, { entityId }) => {
                await this.ensureConnection();
                const registry = await this.client!.getEntityRegistryByEntityId(entityId as string);
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify({ registry }),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );

        this.registerResourceOrTool(
            "get-device-id-by-entity-id",
            new ResourceTemplate("device://by-entity-id/{entityId}", { list: undefined }),
            {
                title: "Get device_id by entity_id",
                description: "Get the device_id for a given entity_id",
                inputSchema: { entityId: z.string().describe("Entity ID, e.g. 'sensor.temperature'") },
                mimeType: "application/json",
                outputSchema: { DeviceIdResponseSchema }
            },
            async (uri: URL, { entityId }) => {
                await this.ensureConnection();
                const deviceId = await this.client!.getDeviceIdByEntityId(entityId as string);
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify({ deviceId }),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );

        this.registerResourceOrTool(
            "get-config-entry-id-by-entity-id",
            new ResourceTemplate("config_entry://by-entity-id/{entityId}", { list: undefined }),
            {
                title: "Get config_entry_id by entity_id",
                description: "Get the config_entry_id for a given entity_id, useful for templated sensors and other config entry flows alike",
                inputSchema: { entityId: z.string().describe("Entity ID, e.g. 'sensor.temperature'") },
                mimeType: "application/json",
                outputSchema: { configEntryId: z.string().describe("Config entry ID for the entity") }
            },
            async (uri: URL, { entityId }) => {
                await this.ensureConnection();
                const configEntryId = await this.client!.getConfigEntryIdByEntityId(entityId as string);
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify({ configEntryId }),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );

        this.server.registerTool(
            "update-device-registry",
            {
                title: "Update device registry",
                description: "Update the device registry for a specific device_id",
                inputSchema: {
                    device_id: z.string().describe("Device ID, e.g. 'device_123'"),
                    device_config: z.object({
                        area_id: z.string().optional().describe("Area ID to assign the device to")
                    }).describe("Any field device configuration to update"),
                },
            },
            async ({ device_id, device_config }) => {
                await this.ensureConnection();
                try {
                    await this.client.updateDeviceRegistry(device_id, device_config);
                    return {
                        content: [{
                            type: "text",
                            text: `Device registry updated for device_id: ${device_id}`,
                            _meta: {}
                        }]
                    };
                } catch (error: unknown) {
                    return {
                        isError: true,
                        content: [{
                            type: "text",
                            text: `Failed to update device registry for ${device_id}: ${error instanceof Error ? error.message : "Unknown error"}`,
                            _meta: { error: true }
                        }]
                    };
                }
            }
        )

        this.server.registerTool(
            "create-config-entry-flow",
            {
                title: "Create config entry flow with a handler helpers",
                description: "Create a new config entry in the Home Assistant entity registry for a new config entry (new templated helpers for ex)",
                inputSchema: {
                    handler: z.string().describe("The handler for the config entry flow")
                },
            },
            async ({ handler }) => {
                await this.ensureConnection();
                try {
                    const flow = await this.client.createConfigEntryFlowREST(handler);
                    return {
                        content: [{
                            type: "text",
                            text: JSON.stringify(flow),
                            _meta: {}
                        }]
                    };
                } catch (error: unknown) {
                    return {
                        isError: true,
                        content: [{
                            type: "text",
                            text: `Failed to create entity flow: ${error instanceof Error ? error.message : "Unknown error"}`,
                            _meta: { error: true }
                        }]
                    };
                }
            }
        );

        this.server.registerTool(
            "continue-config-entry-flow",
            {
                title: "Continue config entry flow",
                description: "Continue an existing config entry flow with a next step Id",
                inputSchema: {
                    flow_id: z.string().describe("The ID of the config entry flow to continue"),
                    next_step_id: z.string().describe("The ID of the next step to execute"),
                }
            },
            async ({ flow_id, next_step_id }) => {
                await this.ensureConnection();
                try {
                    const flow = await this.client.continueConfigEntryFlowREST(flow_id, next_step_id);
                    return {
                        content: [{
                            type: "text",
                            text: JSON.stringify(flow),
                            _meta: {}
                        }]
                    };
                } catch (error: unknown) {
                    return {
                        isError: true,
                        content: [{
                            type: "text",
                            text: `Failed to continue config entry flow: ${error instanceof Error ? error.message : "Unknown error"}`,
                            _meta: { error: true }
                        }]
                    };
                }
            });

        this.server.registerTool(
            "finish-config-entry-flow",
            {
                title: "Finish config entry flow",
                description: "Finish an existing config entry flow",
                inputSchema: {
                    flow_id: z.string().describe("The ID of the config entry flow to finish"),
                    options: z.record(z.string(), z.unknown()).describe("Parameters to finish the flow")
                }
            },
            async ({ flow_id, options }) => {
                await this.ensureConnection();
                try {
                    const flow = await this.client.updateConfigEntryFlowREST(flow_id, options);
                    return {
                        content: [{
                            type: "text",
                            text: JSON.stringify(flow),
                            _meta: {}
                        }]
                    };
                } catch (error: unknown) {
                    return {
                        isError: true,
                        content: [{
                            type: "text",
                            text: `Failed to finish config entry flow: ${error instanceof Error ? error.message : "Unknown error"}`,
                            _meta: { error: true }
                        }]
                    };
                }
            }
        );

        this.server.registerTool(
            "create-config-entry-options-flow",
            {
                title: "Create config entry options flow for a config entry id",
                description: "Create a new config entry options flow for a specific config entry (already existing config entry, templated helpers for ex)",
                inputSchema: {
                    config_entry_id: z.string().describe("The ID of the config entry to create options flow for"),
                }
            },
            async ({ config_entry_id }) => {
                await this.ensureConnection();
                try {
                    const flow = await this.client.createConfigEntryOptionsFlowREST(config_entry_id);
                    return {
                        content: [{
                            type: "text",
                            text: JSON.stringify(flow),
                            _meta: {}
                        }]
                    };
                } catch (error: unknown) {
                    return {
                        isError: true,
                        content: [{
                            type: "text",
                            text: `Failed to create entity flow: ${error instanceof Error ? error.message : "Unknown error"}`,
                            _meta: { error: true }
                        }]
                    };
                }
            }
        );

        this.server.registerTool(
            "update-config-entry-options-flow",
            {
                title: "Update config entry options flow",
                description: "Update an existing config entry options flow",
                inputSchema: {
                    flow_id: z.string().describe("The ID of the config entry flow to update"),
                    options: z.record(z.string(), z.unknown()).describe("Parameters to update the flow")
                }
            },
            async ({ flow_id, options }) => {
                await this.ensureConnection();
                try {
                    const flow = await this.client.updateConfigEntryFlowREST(flow_id, options);
                    return {
                        content: [{
                            type: "text",
                            text: JSON.stringify(flow),
                            _meta: {}
                        }]
                    };
                } catch (error: unknown) {
                    return {
                        isError: true,
                        content: [{
                            type: "text",
                            text: `Failed to update config entry options flow: ${error instanceof Error ? error.message : "Unknown error"}`,
                            _meta: { error: true }
                        }]
                    };
                }
            }
        );

        this.registerResourceOrTool(
            "list-config-entry-flows-helpers",
            new ResourceTemplate("config_entry://flows_helpers", { list: undefined }),
            {
                title: "List helpers types",
                description: "List available config entry flow handlers for helpers",
                inputSchema: {},
                mimeType: "application/json",
                outputSchema: { flows: z.array(z.string()) }
            },
            async (uri: URL) => {
                await this.ensureConnection();
                const flows = await this.client!.getConfigEntriesFlowHandler();
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify({ flows }),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        )
    }
}
