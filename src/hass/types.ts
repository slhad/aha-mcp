import { z } from "zod";

export const HassStatusSchema = z.object({
    connected: z.boolean(),
    entityCount: z.number(),
});
export type HassStatus = z.infer<typeof HassStatusSchema>;

export const DeviceIdResponseSchema = z.object({
    deviceId: z.string(),
});
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
    debugMode: z.boolean().optional().default(false).describe("Enable debug mode for verbose logging").nullish(),
    RESOURCES_TO_TOOLS: z.boolean().optional().default(true).describe("Enable resource to tool conversion").nullish(),
    LIMIT_RESOURCES: z.number().optional().describe("Limit the number of resources to convert, -1 for no limit").default(-1).nullish()
});
export type HASSConfig = z.infer<typeof HASSConfigSchema>;
export type ConfigMcpDef = {
    DEBUG: boolean;
    RESOURCES_TO_TOOLS: boolean;
    LIMIT_RESOURCES: number;
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
}).passthrough();
export const EntityStateArraySchema = z.array(EntityStateSchemaPrime);
export const EntityStateSchema = EntityStateSchemaPrime.describe("Home Assistant entity state object with entity ID, state value, attributes, and context information");
export type EntityState = z.infer<typeof EntityStateSchema>;

export const AutomationSchemaPrime = z.object({
    entityId: z.string(),
    state: z.string(),
    attributes: z.object({
        id: z.string(),
        last_triggered: z.string().nullish(),
        mode: z.string(),
        current: z.number(),
        friendly_name: z.string(),
    }).passthrough(),
    lastChanged: z.string(),
    lastUpdated: z.string(),
    context: z.object({
        id: z.string(),
        parent_id: z.string().nullish(),
        user_id: z.string().nullish(),
    }),
});
export const AutomationSchema = AutomationSchemaPrime.describe("Home Assistant automation entity with state, attributes including automation ID, mode, and execution details");
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
export const AutomationRestSchema = AutomationRestSchemaPrime.describe("Home Assistant automation configuration object with ID, alias, description, triggers, conditions, actions, and execution mode");
export type AutomationRest = z.infer<typeof AutomationRestSchema>;

export const AutomationCreateRestSchemaPrime = AutomationRestSchemaPrime.omit({ id: true });
export const AutomationCreateRestSchema = AutomationCreateRestSchemaPrime.describe("Home Assistant automation creation object without ID, used when creating new automations");
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
export type EntityRegistry = z.infer<typeof EntityRegistrySchema>;

export const ValidateConfigSchemaPrime = z.object({
    triggers: z.array(z.unknown()).optional(),
    conditions: z.array(z.unknown()).optional(),
    actions: z.array(z.unknown()).optional(),
});
export const ValidateConfigSchema = ValidateConfigSchemaPrime.describe("Validation configuration for Home Assistant automation triggers, conditions, and actions");
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
export const ValidateConfigResponseSchema = ValidateConfigResponseSchemaPrime.describe("Validation response for Home Assistant automation configuration with validation results and error details");
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