import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EntityStateArrayJsonSchema, EntityStateArraySchema, EntityStateJsonSchema, EntityStateSchema } from "../hass/types";
import { stripSchemaKey } from "../helpers";
import { BaseMcp } from "./baseMcp";

export class Entities extends BaseMcp {
    register(): void {
        this.registerResourceOrTool(
            "list-entities-by-prefix",
            new ResourceTemplate("entity://list/by-prefix/{prefix}", { list: undefined }),
            {
                title: "List all entities by prefix",
                description: "List all Home Assistant entities by prefix",
                inputSchema: { prefix: z.string().describe("Prefix to filter entities, e.g. 'sensor.'") },
                mimeType: this.options.NO_LONG_INPUT_TYPES ? "application/json" : JSON.stringify(stripSchemaKey(EntityStateArrayJsonSchema)),
                outputSchema: this.options.NO_LONG_OUTPUT_TYPES ? undefined : EntityStateArraySchema
            },
            async (uri: URL, { prefix }) => {
                await this.ensureConnection();
                const entities = await this.client!.getEntitiesByPrefix(prefix as string);
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify(entities),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );

        this.registerResourceOrTool(
            "list-entities-by-regex",
            new ResourceTemplate("entity://list/by-regex/{pattern}/{flags}", { list: undefined }),
            {
                title: "List all entities by regex",
                description: "List all Home Assistant entities matching a regex pattern",
                inputSchema: {
                    pattern: z.string().describe("Regex pattern for entity IDs, e.g. '^sensor\\.'"),
                    flags: z.string().describe("Regex flags, e.g. 'i' for ignore case")
                },
                mimeType: this.options.NO_LONG_INPUT_TYPES ? "application/json" : JSON.stringify(stripSchemaKey(EntityStateArrayJsonSchema)),
                outputSchema: this.options.NO_LONG_OUTPUT_TYPES ? undefined : EntityStateArraySchema
            },
            async (uri: URL, { pattern, flags }) => {
                await this.ensureConnection();
                let regex: RegExp;
                try {
                    regex = new RegExp(pattern as string, flags as string | undefined);
                } catch (e) {
                    throw new Error("Invalid regex pattern or flags: " + pattern + " / " + flags);
                }
                const entities = await this.client!.getEntities(regex);
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify(entities),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );

        this.registerResourceOrTool(
            "get-entity-state",
            new ResourceTemplate("entity://state/{entityId}", { list: undefined }),
            {
                title: "Get state of a specific entity",
                description: "Get state of a specific entity_id",
                inputSchema: { entityId: z.string().describe("Entity ID, e.g. 'sensor.temperature'") },
                mimeType: this.options.NO_LONG_INPUT_TYPES ? "application/json" : JSON.stringify(stripSchemaKey(EntityStateJsonSchema)),
                outputSchema: this.options.NO_LONG_OUTPUT_TYPES ? undefined : EntityStateSchema
            },
            async (uri: URL, { entityId }) => {
                await this.ensureConnection();
                const states = await this.client!.getStates();
                const state = states.find((s) => s.entityId === entityId);
                if (!state) throw new Error(`Entity not found: ${entityId}`);
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify(state),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );

        this.registerResourceOrTool(
            "get-entity-domain",
            new ResourceTemplate("entity://domain/by-entity-id/{entityId}", { list: undefined }),
            {
                title: "Get domain of a specific entity",
                description: "Get domain of a specific entity_id",
                inputSchema: { entityId: z.string().describe("Entity ID, e.g. 'sensor.temperature'") },
                mimeType: this.options.NO_LONG_INPUT_TYPES ? "application/json" : JSON.stringify(stripSchemaKey(EntityStateJsonSchema)),
                outputSchema: this.options.NO_LONG_OUTPUT_TYPES ? undefined : EntityStateArraySchema
            },
            async (uri: URL, { entityId }) => {
                await this.ensureConnection();
                const domain = await this.client!.getEntityDomain(entityId);
                return {
                    contents: [
                        {
                            uri: uri.toString(),
                            text: JSON.stringify(domain),
                            mimeType: "application/json",
                            _meta: {},
                        }
                    ]
                };
            }
        );

        this.registerResourceOrTool(
            "search-related",
            new ResourceTemplate("entity://search/related/{itemType}/{itemId}", { list: undefined }),
            {
                title: "Search related entities",
                description: "Search for entities related to a specific item_type (like 'area') and entity_id (like 'studio')",
                inputSchema: {
                    itemType: z.string().describe("Type of the item, e.g. 'entity', 'area'"),
                    itemId: z.string().describe("ID of the item, e.g. 'sensor.temperature' or 'area.living_room'")
                },
                mimeType: "application/json",
                outputSchema: EntityStateArraySchema
            },
            async (uri: URL, { itemType, itemId }) => {
                await this.ensureConnection();
                const relatedEntities = await this.client!.searchRelatedEntities(itemType, itemId);
                return {
                    contents: Object.entries(relatedEntities).map(([key, entities]) => ({
                        uri: `entity://search/related/${key}/${itemId}`,
                        text: JSON.stringify(entities),
                        mimeType: "application/json",
                        _meta: {},
                    })),
                };
            }
        );

        this.registerResourceOrTool(
            "list-area",
            "area://list",
            {
                title: "List all areas",
                description: "List all Home Assistant areas",
                inputSchema: {},
                mimeType: "application/json",
                outputSchema: undefined
            },
            async () => {
                const areas = await this.client!.listAreas();
                return {
                    contents: areas.map((area) => ({
                        uri: `area://${area.id}`,
                        text: JSON.stringify(area),
                        mimeType: "application/json",
                        _meta: {},
                    })),
                };
            }
        );
    }
}