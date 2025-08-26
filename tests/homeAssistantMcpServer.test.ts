import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { HASSConfig } from "../src/hass/types";
import { HomeAssistantMCPServer } from "../src/server/homeAssistantMcpServer";

import fs from "fs";
let config: HASSConfig;
const hasRealConfig = fs.existsSync(__dirname + "/hass-real-config.ts");
if (hasRealConfig) {
    const imported = await import("./hass-real-config");
    config = imported.realHASSConfig;
} else {
    config = {
        url: "http://localhost:8123",
        accessToken: "dummy-token",
    };
}

process.env["RESOURCES_TO_TOOLS"] = "true";

describe("HomeAssistantMCPServer", () => {

    beforeEach(() => {
        vi.stubEnv("RESOURCES_TO_TOOLS", "true");
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    })

    it("should instantiate", () => {
        const server = new HomeAssistantMCPServer(config);
        expect(server).toBeDefined();
    });
    it("should fail with bad config", async () => {
        const server = new HomeAssistantMCPServer(config);
        const result = await server._invokeTool("validate-config", {
            config: {
                "triggers": [
                    { "domain": "mqtt", "device_id": "7aab08f4c7873cf260b22a517e8d13c3", "type": "action", "subtype": "1_single", "trigger": "device" },
                    { "domain": "mqtt", "device_id": "7aab08f4c7873cf260b22a517e8d13c3", "type": "action", "subtype": "2_single", "trigger": "device" },
                    { "domain": "mqtt", "device_id": "7aab08f4c7873cf260b22a517e8d13c3", "type": "action", "subtype": "3_single", "trigger": "device" },
                    { "domain": "mqtt", "device_id": "7aab08f4c7873cf260b22a517e8d13c3", "type": "action", "subtype": "4_single", "trigger": "device" }
                ],
                "actions": [
                    { "service": "light.turn_on", "target": { "entity_id": "light.chambre_2_lumiere_plafond" }, "data": { "rgb_color": [255, 0, 0] } },
                    { "service": "light.turn_on", "target": { "entity_id": "light.chambre_2_lumiere_plafond" }, "data": { "rgb_color": [0, 0, 255] } },
                    { "service": "light.turn_on", "target": { "entity_id": "light.chambre_2_lumiere_plafond" }, "data": { "rgb_color": [0, 255, 0] } },
                    { "service": "light.turn_on", "target": { "entity_id": "light.chambre_2_lumiere_plafond" }, "data": { "rgb_color": [128, 0, 128] } }
                ],
                "mode": "single"
            }
        });
        expect(result.content[0].type).toBe("text");
        expect(result.content[0].text).toContain("Config validation failed");
        expect(result.content[0]._meta?.error).toBe(true);
    });

    it("should list-automation like a tool", async () => {
        const server = new HomeAssistantMCPServer(config);
        const result = await server._invokeTool("list-automations", {});
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content[0].type).toBe("text");
        expect(result.content[0].text).toBeDefined();
    });

});
