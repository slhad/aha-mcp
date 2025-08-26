import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { stripSchemaKey } from "../helpers";

export const HassStatusSchema = z.object({
    connected: z.boolean(),
    entityCount: z.number(),
});
export const HassStatusJsonSchema = zodToJsonSchema(HassStatusSchema);
export type HassStatus = z.infer<typeof HassStatusSchema>;

export const DeviceIdResponseSchema = z.object({
    deviceId: z.string(),
});
export const DeviceIdResponseJsonSchema = zodToJsonSchema(DeviceIdResponseSchema);
export type DeviceIdResponse = z.infer<typeof DeviceIdResponseSchema>;

export const EntityRegistryArrayType = z.array(z.object({
    entity_id: z.string(),
    device_id: z.string(),
    platform: z.string(),
    config_entry_id: z.string().optional(),
}));
export type EntityRegistryArray = z.infer<typeof EntityRegistryArrayType>;

export const HASSConfigSchema = z.object({
    url: z.string(),
    accessToken: z.string(),
    debugMode: z.boolean().optional(),
    RESOURCES_TO_TOOLS: z.boolean().optional(),
    LIMIT_RESOURCES: z.number().optional(),
    NO_LONG_INPUT_TYPES: z.boolean().optional(),
    NO_LONG_OUTPUT_TYPES: z.boolean().optional(),
    transport: z.enum(["stdio", "sse", "streamablehttp"]).optional(),
    port: z.number().min(1).max(65535).optional(),
});
export type HASSConfig = z.infer<typeof HASSConfigSchema>;
export type ConfigMcpDef = {
    DEBUG: boolean;
    RESOURCES_TO_TOOLS: boolean;
    LIMIT_RESOURCES: number;
    NO_LONG_INPUT_TYPES: boolean;
    NO_LONG_OUTPUT_TYPES: boolean;
}

export const EntityStateSchemaPrime = z.object({
    entityId: z.string(),
    state: z.string(),
    attributes: z.record(z.string(), z.unknown()),
    lastChanged: z.string(),
    lastUpdated: z.string(),
    context: z.object({
        id: z.string(),
        userId: z.string().optional(),
        parentId: z.string().optional(),
    }),
});
export const EntityStateJsonSchema = zodToJsonSchema(EntityStateSchemaPrime);
export const EntityStateArraySchema = z.array(EntityStateSchemaPrime);
export const EntityStateArrayJsonSchema = zodToJsonSchema(EntityStateArraySchema);
export const EntityStateSchema = EntityStateSchemaPrime.describe(JSON.stringify(EntityStateJsonSchema));
export type EntityState = z.infer<typeof EntityStateSchema>;

export const AutomationSchemaPrime = z.object({
    entityId: z.string(),
    state: z.string(),
    attributes: z.object({
        id: z.string(),
        last_triggered: z.string(),
        mode: z.string(),
        current: z.number(),
        friendly_name: z.string(),
    }),
    lastChanged: z.string(),
    lastUpdated: z.string(),
    context: z.object({
        id: z.string(),
        parentId: z.string().nullable(),
        userId: z.string().nullable(),
    }),
});
export const AutomationJsonSchema = zodToJsonSchema(AutomationSchemaPrime);
export const AutomationSchema = AutomationSchemaPrime.describe(JSON.stringify(AutomationJsonSchema));
export type Automation = z.infer<typeof AutomationSchema>;

export const AutomationRestSchemaPrime = z.object({
    id: z.string(),
    alias: z.string(),
    description: z.string(),
    triggers: z.array(z.unknown()),
    conditions: z.array(z.unknown()),
    actions: z.array(z.unknown()),
    mode: z.enum(["single", "parallel", "queued", "restart"]),
});
export const AutomationRestJsonSchema = zodToJsonSchema(AutomationRestSchemaPrime);
export const AutomationRestSchema = AutomationRestSchemaPrime.describe(JSON.stringify(AutomationRestJsonSchema));
export type AutomationRest = z.infer<typeof AutomationRestSchema>;

export const AutomationCreateRestSchemaPrime = AutomationRestSchemaPrime.omit({ id: true });
export const AutomationCreateRestJsonSchema = zodToJsonSchema(AutomationCreateRestSchemaPrime);
export const AutomationCreateRestSchema = AutomationCreateRestSchemaPrime.describe(JSON.stringify(AutomationCreateRestJsonSchema));
export type AutomationCreateRest = z.infer<typeof AutomationCreateRestSchema>;

export const EntityRegistrySchema = z.object({
    area_id: z.string().nullable(),
    categories: z.record(z.string(), z.unknown()),
    config_entry_id: z.string().nullable(),
    config_subentry_id: z.string().nullable(),
    created_at: z.number(),
    device_id: z.string().nullable(),
    disabled_by: z.string().nullable(),
    entity_category: z.string().nullable(),
    entity_id: z.string(),
    has_entity_name: z.boolean(),
    hidden_by: z.string().nullable(),
    icon: z.string().nullable(),
    id: z.string(),
    labels: z.array(z.string()),
    modified_at: z.number(),
    name: z.string().nullable(),
    options: z.object({
        conversation: z.object({
            should_expose: z.boolean(),
        }).optional(),
    }),
    original_name: z.string(),
    platform: z.string(),
    translation_key: z.string().nullable(),
    unique_id: z.string(),
    aliases: z.array(z.string()),
    capabilities: z.unknown().nullable(),
    device_class: z.string().nullable(),
    original_device_class: z.string().nullable(),
    original_icon: z.string().nullable(),
});
export const EntityRegistryJsonSchema = zodToJsonSchema(EntityRegistrySchema);
export const EntityRegistryArrayJsonSchema = zodToJsonSchema(z.array(EntityRegistrySchema));
export type EntityRegistry = z.infer<typeof EntityRegistrySchema>;

export const ValidateConfigSchemaPrime = z.object({
    triggers: z.array(z.unknown()).optional(),
    conditions: z.array(z.unknown()).optional(),
    actions: z.array(z.unknown()).optional(),
});
export const ValidateConfigJSONSchema = zodToJsonSchema(ValidateConfigSchemaPrime);
export const ValidateConfigSchema = ValidateConfigSchemaPrime.describe(JSON.stringify(stripSchemaKey(ValidateConfigJSONSchema)));
export type ValidateConfig = z.infer<typeof ValidateConfigSchema>;

export const ValidateConfigResponseSchemaPrime = z.object({
    triggers: z.object({
        valid: z.boolean(),
        errors: z.array(z.string()),
    }).optional(),
    conditions: z.object({
        valid: z.boolean(),
        errors: z.array(z.string()),
    }).optional(),
    actions: z.object({
        valid: z.boolean(),
        errors: z.array(z.string()),
    }).optional(),
});
export const ValidateConfigResponseJSONSchema = zodToJsonSchema(ValidateConfigResponseSchemaPrime);
export const ValidateConfigResponseSchema = ValidateConfigResponseSchemaPrime.describe(JSON.stringify(ValidateConfigResponseJSONSchema));
export type ValidateConfigResponse = z.infer<typeof ValidateConfigResponseSchema>;


export const AutomationRestTraceSchema = z.object({
    last_step: z.string(),
    run_id: z.string(),
    state: z.string(),
    script_execution: z.string(),
    timestamp: z.object({
        start: z.string(),
        finish: z.string(),
    }),
    domain: z.string(),
    item_id: z.string(),
    trigger: z.string(),
    trace: z.record(z.string(), z.array(z.object({
        path: z.string(),
        timestamp: z.string(),
        changed_variables: z.record(z.string(), z.unknown()).optional(),
        result: z.record(z.string(), z.unknown()).optional(),
    }))),
    config: z.object({
        id: z.string(),
        alias: z.string(),
        description: z.string(),
        triggers: z.array(z.record(z.string(), z.unknown())),
        conditions: z.array(z.unknown()),
        actions: z.array(z.unknown()),
        mode: z.string(),
    }),
    blueprint_inputs: z.unknown(),
    context: z.object({
        id: z.string(),
        parent_id: z.string(),
        user_id: z.string().nullable(),
    }),
});
export const AutomationRestTraceJsonSchema = zodToJsonSchema(AutomationRestTraceSchema);
export type AutomationRestTrace = z.infer<typeof AutomationRestTraceSchema>;

export const AutomationRestShortSchema = z.object({
    last_step: z.string(),
    run_id: z.string(),
    state: z.string(),
    script_execution: z.string(),
    timestamp: z.object({
        start: z.string(),
        finish: z.string(),
    }),
    domain: z.string(),
    item_id: z.string(),
    trigger: z.string(),
});
export const AutomationRestShortArraySchema = z.array(AutomationRestShortSchema);
export const AutomationRestShortArrayJsonSchema = zodToJsonSchema(AutomationRestShortArraySchema);
export const AutomationRestShortJsonSchema = zodToJsonSchema(AutomationRestShortSchema);
export type AutomationRestShort = z.infer<typeof AutomationRestShortSchema>;

export const ConfigEntryFlowSchema = z.object({
    type: z.string(),
    flow_id: z.string(),
    handler: z.string(),
    data_schema: z.array(
        z.object({
            selector: z.record(z.string(), z.unknown()),
            name: z.string(),
            description: z.object({
                suggested_value: z.unknown(),
            }).optional(),
            required: z.boolean().optional(),
            optional: z.boolean().optional(),
        })
    ),
    errors: z.unknown().nullable(),
    description_placeholders: z.unknown().nullable(),
    last_step: z.boolean(),
    preview: z.string(),
    step_id: z.string(),
});