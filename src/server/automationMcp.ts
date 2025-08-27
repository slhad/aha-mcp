import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
    AutomationCreateRest,
    AutomationCreateRestSchema,
    AutomationRest,
    AutomationRestSchema,
    AutomationRestShortArraySchema,
    AutomationRestTraceSchema,
    AutomationSchema
} from "../hass/types.js";
import { BaseMcp } from "./baseMcp.js";

export class AutomationMcp extends BaseMcp {

    register() {
        this.registerResourceOrTool(
            "get-rest-automation-trace",
            new ResourceTemplate("automation://rest/trace/{rest_id}/{run_id}", { list: undefined }),
            {
                title: "Get automation trace by rest_id and run_id",
                description: "Fetches the trace for a specific automation run using its REST id and run id.",
                inputSchema: {
                    rest_id: z.string().describe("Automation REST API id"),
                    run_id: z.string().describe("Automation run id"),
                },
                mimeType: "application/json",
                outputSchema: AutomationRestTraceSchema
            },
            async (uri: URL, { rest_id, run_id }) => {
                await this.ensureConnection();
                const trace = await this.client!.getAutomationTrace(rest_id as string, run_id as string);
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify(trace),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );

        this.registerResourceOrTool(
            "list-rest-automation-traces",
            new ResourceTemplate("automation://rest/traces/{rest_id}", { list: undefined }),
            {
                title: "List automation traces by rest_id",
                description: "List all traces for a specific automation using its REST id.",
                inputSchema: {
                    rest_id: z.string().describe("Automation REST API id"),
                },
                mimeType: "application/json",
                outputSchema: AutomationRestShortArraySchema
            },
            async (uri: URL, { rest_id }) => {
                await this.ensureConnection();
                const traces = await this.client!.listAutomationTraces(rest_id as string);
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify(traces),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );

        this.registerResourceOrTool(
            "list-automations",
            "automation://list",
            {
                title: "List all automations",
                description: "List all automations",
                inputSchema: {},
                mimeType: "application/json",
                outputSchema: z.array(AutomationSchema)
            },
            async () => {
                await this.ensureConnection();
                const automations = await this.client!.getAutomations();
                return {
                    contents: [
                        {
                            uri: "automation://list",
                            text: JSON.stringify(automations),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );

        this.server.registerTool(
            "delete-automation",
            {
                title: "Delete an automation",
                description: "Delete an automation by id",
                inputSchema: { id: z.string().describe("Automation unique ID") },
            },
            async (args: Record<string, unknown>) => {
                await this.ensureConnection();
                const id = args.id as string;
                await this.client!.deleteAutomation(id);
                return { content: [{ type: "text", text: JSON.stringify({ success: true }), _meta: {} }] };
            }
        );

        this.registerResourceOrTool(
            "get-automation-by-entity-id",
            new ResourceTemplate("automation://by-entity-id/{entity_id}", { list: undefined }),
            {
                title: "Get automation by entity_id",
                description: "Find an automation entity using its entity_id (e.g. automation.my_automation).",
                inputSchema: { entity_id: z.string().describe("Automation entity_id, e.g. 'automation.my_automation'") },
                mimeType: "application/json",
                outputSchema: AutomationSchema
            },
            async (uri: URL, { entity_id }) => {
                await this.ensureConnection();
                const automation = await this.client!.getAutomationByEntityId(entity_id as string);
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify(automation),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );

        this.registerResourceOrTool(
            "get-rest-automation-by-entity-id",
            new ResourceTemplate("automation://rest/by-entity-id/{entity_id}", { list: undefined }),
            {
                title: "Get REST automation by entity_id",
                description: "Get an automation's REST definition using its entity_id (e.g. automation.my_automation).",
                inputSchema: { entity_id: z.string().describe("Automation entity_id, e.g. 'automation.my_automation'") },
                mimeType: "application/json",
                outputSchema: AutomationRestSchema
            },
            async (uri: URL, { entity_id }) => {
                await this.ensureConnection();
                const automation = await this.client!.getAutomationRestByEntityId(entity_id as string);
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify(automation),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );

        this.server.registerTool(
            "update-automation-by-entity-id",
            {
                title: "Update automation by entity_id",
                description: "Update an automation using its entity_id (e.g. automation.my_automation).",
                inputSchema: {
                    entity_id: z.string().describe("Automation entity_id, e.g. 'automation.my_automation'"),
                    automation: AutomationRestSchema,
                },
            },
            async (args: Record<string, unknown>) => {
                await this.ensureConnection();
                const entityId = args.entity_id as string;
                const automation = args.automation as AutomationRest;
                await this.client!.updateAutomation(entityId, automation);
                return { content: [{ type: "text", text: JSON.stringify({ success: true }), _meta: {} }] };
            }
        );

        this.registerResourceOrTool(
            "get-automation-by-rest-id",
            new ResourceTemplate("automation://by-rest-id/{rest_id}", { list: undefined }),
            {
                title: "Get automation by rest_id",
                description: "Find an automation entity using its REST API id (rest_id, not entity_id).",
                inputSchema: { rest_id: z.string().describe("Automation REST API id") },
                mimeType: "application/json",
                outputSchema: AutomationSchema
            },
            async (uri: URL, { rest_id }) => {
                await this.ensureConnection();
                const automation = await this.client!.getAutomationByRestId(rest_id as string);
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify(automation),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );

        this.registerResourceOrTool(
            "get-rest-automation-by-rest-id",
            new ResourceTemplate("automation://rest/by-rest-id/{rest_id}", { list: undefined }),
            {
                title: "Get REST automation by rest_id",
                description: "Get an automation's REST definition using its rest_id (REST API id, not entity_id).",
                inputSchema: { rest_id: z.string().describe("Automation REST API id") },
                mimeType: "application/json",
                outputSchema: AutomationRestSchema
            },
            async (uri: URL, { rest_id }) => {
                await this.ensureConnection();
                const automation = await this.client!.getAutomationREST(rest_id as string);
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify(automation),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );

        this.server.registerTool(
            "update-rest-automation-by-rest-id",
            {
                title: "Update REST automation by rest_id",
                description: "Update an automation using its rest_id (REST API id, not entity_id).",
                inputSchema: { automation: AutomationRestSchema },
            },
            async (args: Record<string, unknown>) => {
                await this.ensureConnection();
                const automation = args.automation as AutomationRest;
                await this.client!.updateAutomationREST(automation);
                return { content: [{ type: "text", text: JSON.stringify({ success: true }), _meta: {} }] };
            }
        );

        this.server.registerTool(
            "delete-rest-automation-by-rest-id",
            {
                title: "Delete REST automation by rest_id",
                description: "Delete an automation using its rest_id (REST API id, not entity_id).",
                inputSchema: { rest_id: z.string().describe("Automation REST API id") },
            },
            async (args: Record<string, unknown>) => {
                await this.ensureConnection();
                const restId = args.rest_id as string;
                await this.client!.deleteAutomationREST(restId);
                return { content: [{ type: "text", text: JSON.stringify({ success: true }), _meta: {} }] };
            }
        );

        this.server.registerTool(
            "create-rest-automation",
            {
                title: "Create REST automation",
                description: "Create a new automation via the Home Assistant REST API. Returns the new rest_id.",
                inputSchema: { automation: AutomationCreateRestSchema },
            },
            async ({ automation }) => {
                await this.ensureConnection();
                const id = await this.client!.createAutomationREST(automation as AutomationCreateRest);
                return { content: [{ type: "text", text: JSON.stringify({ rest_id: id }), _meta: {} }] };
            }
        );

        this.registerResourceOrTool(
            "list-device-automation-triggers",
            new ResourceTemplate("automation://device/{device_id}/triggers", { list: undefined }),
            {
                title: "List device automation triggers",
                description: "List all triggers for a specific device's automations.",
                inputSchema: { device_id: z.string().describe("Device ID") },
                mimeType: "application/json",
                outputSchema: undefined
            },
            async (uri: URL, { device_id }) => {
                await this.ensureConnection();
                const triggers = await this.client!.listDeviceAutomationTriggers(device_id as string);
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify(triggers),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );
    }
}