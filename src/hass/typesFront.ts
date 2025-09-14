import { z } from "zod";

// Action schemas
export const TapActionSchema = z.object({
    action: z.enum(["none", "toggle", "more-info", "perform-action"]),
    perform_action: z.string().optional(),
    target: z.object({
        entity_id: z.string(),
    }).optional(),
    data: z.record(z.string(), z.unknown()).optional(),
});

export const HoldActionSchema = z.object({
    action: z.enum(["none", "toggle", "more-info", "perform-action"]),
    perform_action: z.string().optional(),
    target: z.object({
        entity_id: z.string(),
    }).optional(),
    data: z.record(z.string(), z.unknown()).optional(),
});

export const DoubleTapActionSchema = z.object({
    action: z.enum(["none", "toggle", "more-info", "perform-action"]),
});

// Grid options schema
export const GridOptionsSchema = z.object({
    columns: z.number(),
    rows: z.number(),
});

// Visibility condition schema
export const VisibilityConditionSchema = z.object({
    condition: z.enum(["state"]),
    entity: z.string(),
    state: z.string(),
});

// Entity reference schema (for history graph, etc.)
export const EntityReferenceSchema = z.object({
    entity: z.string(),
    name: z.string().optional(),
});

// Base card schema with common properties
export const BaseCardSchema = z.object({
    type: z.string(),
});

// Heading card schema
export const HeadingCardSchema = BaseCardSchema.extend({
    type: z.literal("heading"),
    heading: z.string(),
    heading_style: z.enum(["title", "subtitle"]),
    icon: z.string().optional(),
});

// Mushroom light card schema
export const MushroomLightCardSchema = BaseCardSchema.extend({
    type: z.literal("custom:mushroom-light-card"),
    entity: z.string(),
    layout: z.enum(["horizontal", "vertical"]).optional(),
    use_light_color: z.boolean().optional(),
    show_brightness_control: z.boolean().optional(),
    show_color_temp_control: z.boolean().optional(),
    show_color_control: z.boolean().optional(),
    collapsible_controls: z.boolean().optional(),
    tap_action: TapActionSchema.optional(),
    hold_action: HoldActionSchema.optional(),
    double_tap_action: DoubleTapActionSchema.optional(),
    name: z.string().optional(),
});

// Tile card schema
export const TileCardSchema = BaseCardSchema.extend({
    type: z.literal("tile"),
    entity: z.string(),
    features_position: z.enum(["top", "bottom", "left", "right"]).optional(),
    vertical: z.boolean().optional(),
    show_entity_picture: z.boolean().optional(),
    hide_state: z.boolean().optional(),
    name: z.string().optional(),
    state_content: z.array(z.string()).optional(),
    hold_action: HoldActionSchema.optional(),
});

// WebRTC camera card schema
export const WebRTCCameraCardSchema = BaseCardSchema.extend({
    type: z.literal("custom:webrtc-camera"),
    url: z.string(),
});

// History graph card schema
export const HistoryGraphCardSchema = BaseCardSchema.extend({
    type: z.literal("history-graph"),
    entities: z.array(EntityReferenceSchema),
    logarithmic_scale: z.boolean().optional(),
    min_y_axis: z.number().optional(),
    max_y_axis: z.number().optional(),
    grid_options: GridOptionsSchema.optional(),
    hours_to_show: z.number().optional(),
});

// Mushroom select card schema
export const MushroomSelectCardSchema = BaseCardSchema.extend({
    type: z.literal("custom:mushroom-select-card"),
    entity: z.string(),
    name: z.string().optional(),
    layout: z.enum(["horizontal", "vertical"]).optional(),
});

// Mushroom climate card schema
export const MushroomClimateCardSchema = BaseCardSchema.extend({
    type: z.literal("custom:mushroom-climate-card"),
    entity: z.string(),
    name: z.string().optional(),
    layout: z.enum(["horizontal", "vertical"]).optional(),
    fill_container: z.boolean().optional(),
    show_temperature_control: z.boolean().optional(),
    collapsible_controls: z.boolean().optional(),
});

// Entities card schema
export const EntitiesCardSchema = BaseCardSchema.extend({
    type: z.literal("entities"),
    entities: z.array(z.union([
        z.string(), // Direct entity ID
        z.object({
            entity: z.string(),
            name: z.string().optional(),
            secondary_info: z.enum(["last-changed", "last-updated", "entity-id", "none"]).optional(),
        }),
    ])),
    state_color: z.boolean().optional(),
});

// Mushroom number card schema
export const MushroomNumberCardSchema = BaseCardSchema.extend({
    type: z.literal("custom:mushroom-number-card"),
    entity: z.string(),
    name: z.string().optional(),
    layout: z.enum(["horizontal", "vertical"]).optional(),
    fill_container: z.boolean().optional(),
    display_mode: z.enum(["slider", "buttons"]).optional(),
    icon: z.string().optional(),
});

// Auto-entities card filter schemas
export const AutoEntitiesFilterIncludeSchema = z.object({
    options: z.record(z.string(), z.unknown()),
    domain: z.string().optional(),
    area: z.string().optional(),
});

export const AutoEntitiesFilterExcludeSchema = z.object({
    options: z.record(z.string(), z.unknown()),
    attributes: z.record(z.string(), z.string()).optional(),
    entity_id: z.string().optional(),
});

export const AutoEntitiesFilterSchema = z.object({
    include: z.array(AutoEntitiesFilterIncludeSchema),
    exclude: z.array(AutoEntitiesFilterExcludeSchema).optional(),
});

export const AutoEntitiesCardSchema = BaseCardSchema.extend({
    type: z.literal("custom:auto-entities"),
    filter: AutoEntitiesFilterSchema,
    show_empty: z.boolean().optional(),
    card: z.object({
        type: z.string(),
    }),
    card_param: z.string().optional(),
});

// Vertical stack card schema
export const VerticalStackCardSchema = BaseCardSchema.extend({
    type: z.literal("vertical-stack"),
    cards: z.lazy(() => z.array(LovelaceCardSchema)).optional(),
});

// ApexCharts card schemas
export const ApexChartsHeaderSchema = z.object({
    title: z.string(),
    show: z.boolean(),
});

export const ApexChartsGroupBySchema = z.object({
    duration: z.string(),
});

export const ApexChartsSpanSchema = z.object({
    start: z.string(),
    offset: z.string(),
});

export const ApexChartsSeriesSchema = z.object({
    entity: z.string(),
    name: z.string(),
    stroke_width: z.number().optional(),
    type: z.enum(["line", "area", "column", "scatter"]),
    group_by: ApexChartsGroupBySchema.optional(),
});

export const ApexChartsChartSchema = z.object({
    height: z.number().optional(),
    width: z.union([z.number(), z.string()]).optional(),
    type: z.string().optional(),
    stacked: z.boolean().optional(),
    id: z.string().optional(),
    dropShadow: z.object({
        enabled: z.boolean().optional(),
        blur: z.number().optional(),
        opacity: z.number().optional(),
        top: z.number().optional(),
        left: z.number().optional(),
        color: z.string().optional(),
    }).optional(),
    toolbar: z.object({
        show: z.boolean().optional(),
    }).optional(),
    zoom: z.object({
        enabled: z.boolean().optional(),
        type: z.string().optional(),
    }).optional(),
    animations: z.object({
        enabled: z.boolean().optional(),
        easing: z.string().optional(),
        dynamicAnimation: z.object({
            speed: z.number().optional(),
        }).optional(),
    }).optional(),
    sparkline: z.object({
        enabled: z.boolean().optional(),
    }).optional(),
});

export const ApexChartsPlotOptionsSchema = z.object({
    bar: z.object({
        horizontal: z.boolean().optional(),
        borderRadius: z.union([z.number(), z.string()]).optional(),
        borderRadiusApplication: z.string().optional(),
        borderRadiusWhenStacked: z.string().optional(),
        barHeight: z.union([z.string(), z.number()]).optional(),
        columnWidth: z.union([z.string(), z.number()]).optional(),
        distributed: z.boolean().optional(),
        dataLabels: z.object({
            position: z.string().optional(),
            total: z.object({
                enabled: z.boolean().optional(),
                style: z.object({
                    fontSize: z.string().optional(),
                    fontWeight: z.union([z.string(), z.number()]).optional(),
                }).optional(),
            }).optional(),
        }).optional(),
        colors: z.object({
            ranges: z.array(z.object({
                from: z.number(),
                to: z.number(),
                color: z.string(),
            })).optional(),
        }).optional(),
        isDumbbell: z.boolean().optional(),
        dumbbellColors: z.array(z.array(z.string())).optional(),
        isFunnel: z.boolean().optional(),
    }).optional(),
    pie: z.object({
        startAngle: z.number().optional(),
        endAngle: z.number().optional(),
        offsetY: z.number().optional(),
    }).optional(),
    candlestick: z.object({
        type: z.string().optional(),
    }).optional(),
    radialBar: z.object({
        startAngle: z.number().optional(),
        endAngle: z.number().optional(),
        track: z.object({
            background: z.string().optional(),
            strokeWidth: z.union([z.string(), z.number()]).optional(),
            margin: z.number().optional(),
            dropShadow: z.object({
                enabled: z.boolean().optional(),
                top: z.number().optional(),
                left: z.number().optional(),
                color: z.string().optional(),
                opacity: z.number().optional(),
                blur: z.number().optional(),
            }).optional(),
        }).optional(),
        dataLabels: z.object({
            name: z.object({
                show: z.boolean().optional(),
            }).optional(),
            value: z.object({
                offsetY: z.number().optional(),
                fontSize: z.string().optional(),
            }).optional(),
        }).optional(),
    }).optional(),
});

export const ApexChartsDataLabelsSchema = z.object({
    enabled: z.boolean().optional(),
    formatter: z.any().optional(),
    offsetY: z.number().optional(),
    offsetX: z.number().optional(),
    style: z.object({
        fontSize: z.string().optional(),
        colors: z.array(z.string()).optional(),
    }).optional(),
    textAnchor: z.string().optional(),
    dropShadow: z.object({
        enabled: z.boolean().optional(),
    }).optional(),
});

export const ApexChartsXAxisSchema = z.object({
    categories: z.array(z.union([z.string(), z.number()])).optional(),
    type: z.string().optional(),
    position: z.string().optional(),
    axisBorder: z.object({
        show: z.boolean().optional(),
    }).optional(),
    axisTicks: z.object({
        show: z.boolean().optional(),
    }).optional(),
    crosshairs: z.object({
        fill: z.object({
            type: z.string().optional(),
            gradient: z.object({
                colorFrom: z.string().optional(),
                colorTo: z.string().optional(),
                stops: z.array(z.number()).optional(),
                opacityFrom: z.number().optional(),
                opacityTo: z.number().optional(),
            }).optional(),
        }).optional(),
    }).optional(),
    tooltip: z.object({
        enabled: z.boolean().optional(),
    }).optional(),
    labels: z.object({
        rotate: z.number().optional(),
        formatter: z.any().optional(),
    }).optional(),
    tickAmount: z.number().optional(),
});

export const ApexChartsYAxisSchema = z.object({
    show: z.boolean().optional(),
    reversed: z.boolean().optional(),
    axisBorder: z.object({
        show: z.boolean().optional(),
    }).optional(),
    axisTicks: z.object({
        show: z.boolean().optional(),
    }).optional(),
    labels: z.object({
        show: z.boolean().optional(),
        formatter: z.any().optional(),
    }).optional(),
    title: z.object({
        text: z.string().optional(),
    }).optional(),
    max: z.number().optional(),
    min: z.number().optional(),
    stepSize: z.number().optional(),
    tickAmount: z.number().optional(),
    tooltip: z.object({
        enabled: z.boolean().optional(),
    }).optional(),
});

export const ApexChartsFillSchema = z.object({
    opacity: z.number().optional(),
    type: z.string().optional(),
    colors: z.array(z.string()).optional(),
    gradient: z.object({
        shade: z.string().optional(),
        gradientToColors: z.array(z.string()).optional(),
        shadeIntensity: z.number().optional(),
        type: z.string().optional(),
        opacityFrom: z.number().optional(),
        opacityTo: z.number().optional(),
        stops: z.array(z.number()).optional(),
        inverseColors: z.boolean().optional(),
    }).optional(),
    pattern: z.object({
        style: z.union([z.string(), z.array(z.string())]).optional(),
    }).optional(),
});

export const ApexChartsStrokeSchema = z.object({
    width: z.union([z.number(), z.array(z.number())]).optional(),
    curve: z.string().optional(),
    colors: z.array(z.string()).optional(),
});

export const ApexChartsLegendSchema = z.object({
    show: z.boolean().optional(),
    showForSingleSeries: z.boolean().optional(),
    position: z.string().optional(),
    offsetY: z.number().optional(),
    offsetX: z.number().optional(),
    horizontalAlign: z.string().optional(),
    customLegendItems: z.array(z.string()).optional(),
});

export const ApexChartsTooltipSchema = z.object({
    enabled: z.boolean().optional(),
    shared: z.boolean().optional(),
    intersect: z.boolean().optional(),
    y: z.object({
        formatter: z.any().optional(),
    }).optional(),
    x: z.object({
        show: z.boolean().optional(),
        formatter: z.any().optional(),
    }).optional(),
});

export const ApexChartsGridSchema = z.object({
    xaxis: z.object({
        lines: z.object({
            show: z.boolean().optional(),
        }).optional(),
    }).optional(),
    yaxis: z.object({
        lines: z.object({
            show: z.boolean().optional(),
        }).optional(),
    }).optional(),
    padding: z.object({
        top: z.number().optional(),
        bottom: z.number().optional(),
    }).optional(),
});

export const ApexChartsAnnotationsSchema = z.object({
    xaxis: z.array(z.object({
        x: z.union([z.string(), z.number()]).optional(),
        borderColor: z.string().optional(),
        label: z.object({
            borderColor: z.string().optional(),
            style: z.object({
                color: z.string().optional(),
                background: z.string().optional(),
                fontSize: z.string().optional(),
            }).optional(),
            text: z.string().optional(),
            orientation: z.string().optional(),
            offsetY: z.number().optional(),
        }).optional(),
    })).optional(),
    yaxis: z.array(z.object({
        y: z.union([z.string(), z.number()]).optional(),
        y2: z.union([z.string(), z.number()]).optional(),
        label: z.object({
            text: z.string().optional(),
        }).optional(),
    })).optional(),
});

export const ApexChartsResponsiveSchema = z.array(z.object({
    breakpoint: z.number(),
    options: z.record(z.string(), z.unknown()),
}));

export const ApexChartsTitleSchema = z.object({
    text: z.string().optional(),
    align: z.string().optional(),
    floating: z.boolean().optional(),
    offsetY: z.number().optional(),
    offsetX: z.number().optional(),
    style: z.object({
        color: z.string().optional(),
        fontSize: z.string().optional(),
    }).optional(),
});

export const ApexChartsSubtitleSchema = z.object({
    text: z.string().optional(),
    offsetX: z.number().optional(),
});

export const ApexChartsCardSchema = BaseCardSchema.extend({
    type: z.literal("custom:apexcharts-card"),
    header: ApexChartsHeaderSchema.optional(),
    series: z.array(ApexChartsSeriesSchema),
    chart_type: z.enum(["line", "area", "column", "pie", "donut", "radialBar", "scatter"]),
    span: ApexChartsSpanSchema.optional(),
    chart: ApexChartsChartSchema.optional(),
    plotOptions: ApexChartsPlotOptionsSchema.optional(),
    dataLabels: ApexChartsDataLabelsSchema.optional(),
    xaxis: ApexChartsXAxisSchema.optional(),
    yaxis: ApexChartsYAxisSchema.optional(),
    fill: ApexChartsFillSchema.optional(),
    stroke: ApexChartsStrokeSchema.optional(),
    legend: ApexChartsLegendSchema.optional(),
    tooltip: ApexChartsTooltipSchema.optional(),
    grid: ApexChartsGridSchema.optional(),
    annotations: ApexChartsAnnotationsSchema.optional(),
    responsive: ApexChartsResponsiveSchema.optional(),
    title: ApexChartsTitleSchema.optional(),
    subtitle: ApexChartsSubtitleSchema.optional(),
    labels: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
});

// Grid card schema (nested grid)
export const GridCardSchema: z.ZodType<unknown> = BaseCardSchema.extend({
    type: z.literal("grid"),
    square: z.boolean().optional(),
    columns: z.number().optional(),
    cards: z.lazy(() => z.array(LovelaceCardSchema)),
});

// Union of all card types
export const LovelaceCardSchema: z.ZodType<unknown> = z.union([
    HeadingCardSchema,
    MushroomLightCardSchema,
    TileCardSchema,
    WebRTCCameraCardSchema,
    HistoryGraphCardSchema,
    MushroomSelectCardSchema,
    MushroomClimateCardSchema,
    EntitiesCardSchema,
    MushroomNumberCardSchema,
    AutoEntitiesCardSchema,
    VerticalStackCardSchema,
    ApexChartsCardSchema,
    GridCardSchema,
]);

// Badge schema
export const BadgeSchema = z.object({
    type: z.literal("entity"),
    show_name: z.boolean().optional(),
    show_state: z.boolean().optional(),
    show_icon: z.boolean().optional(),
    show_entity_picture: z.boolean().optional(),
    entity: z.string(),
    name: z.string().optional(),
    tap_action: TapActionSchema.optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
});

// Section schema
export const SectionSchema = z.object({
    type: z.literal("grid"),
    cards: z.array(LovelaceCardSchema),
    visibility: z.array(VisibilityConditionSchema).optional(),
});

// View schema
export const ViewSchema = z.object({
    title: z.string(),
    sections: z.array(SectionSchema),
    badges: z.array(BadgeSchema),
    type: z.literal("sections"),
    max_columns: z.number().optional(),
    dense_section_placement: z.boolean().optional(),
    cards: z.array(z.unknown()), // Legacy property, usually empty
});

// Main dashboard config schema
export const DashboardConfigSchema = z.object({
    views: z.array(ViewSchema),
});

export type DashboardConfig = z.infer<typeof DashboardConfigSchema>;
export type LovelaceCard = z.infer<typeof LovelaceCardSchema>;
export type View = z.infer<typeof ViewSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Badge = z.infer<typeof BadgeSchema>;