import { describe, expect, it } from "vitest";
import { HASSClient } from "../src/hass/hassClient";
import type { Automation, AutomationCreateRest, AutomationRest, HASSConfig } from "../src/hass/types";

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


describe("HASSClient", () => {
    it("should instantiate", async () => {
        const client = await HASSClient.create(config);
        expect(client).toBeDefined();
    });

    it("should fetch entity states", async () => {
        const client = await HASSClient.create(config);
        const states = await client.getStates();
        expect(Array.isArray(states)).toBe(true);
        expect(states.length).toBeGreaterThan(0);
        expect(states[0]).toHaveProperty("entityId");
        expect(states[0]).toHaveProperty("state");
    });

    it("should fetch automations", async () => {
        const client = await HASSClient.create(config);
        const automations = await client.getAutomations();
        expect(Array.isArray(automations)).toBe(true);
        if (automations.length > 0) {
            expect(automations[0]).toHaveProperty("entityId");
            expect(automations[0]).toHaveProperty("attributes");
        }
    });
    it("should get automation for 'test-automation'", async () => {
        const client = await HASSClient.create(config);
        const automation = await client.getAutomationByEntityId("test_automation");
        expect(automation).toHaveProperty("entityId");
        expect((automation as Automation).entityId).toBe("automation.test_automation");
    });

    it("should update automation for 'test-automation'", async () => {
        const client = await HASSClient.create(config);
        const automation = await client.getAutomationByEntityId("test_automation");

        expect(automation).toBeDefined();

        const automationRest = await client.getAutomationRestByEntityId("test_automation");
        expect(automationRest).toBeDefined();
        expect(automationRest.alias).toBe("test-automation");
        const updated = {
            ...(automationRest as AutomationRest),
            alias: "Updated Alias",
        };
        await client.updateAutomation("test_automation", updated);
        const updatedAutomationRest = await client.getAutomationRestByEntityId("test_automation");
        expect(updatedAutomationRest.alias).toBe("Updated Alias");

        // Reset the alias to original for next tests
        updated.alias = "test-automation";
        await client.updateAutomation("test_automation", updated);
        const resetAutomation = await client.getAutomationRestByEntityId("test_automation");
        expect(resetAutomation!.alias).toBe("test-automation");
    });

    it("should create and delete an automation", async () => {
        const client = await HASSClient.create(config);
        const alias = "Test Automation UT";
        const newAutomation: AutomationCreateRest = {
            "description": "",
            "mode": "single",
            "triggers": [{ "trigger": "state", "entity_id": ["switch.bibliotheque_thermostat_child_lock"], "to": "on" }],
            "conditions": [],
            "actions": [],
            "alias": alias
        };
        const restId = await client.createAutomation(newAutomation);
        expect(restId).toBeDefined();
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for Home Assistant to process the new automation

        const automationRest = await client.getAutomationREST(restId);
        expect(automationRest).toBeDefined();
        expect(automationRest.alias).toBe(alias);

        const createdAutomation = await client.getAutomationByRestId(restId);
        expect(createdAutomation).toBeDefined();
        if (createdAutomation) {
            await client.deleteAutomation(createdAutomation.entityId);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for Home Assistant to process the deletion
            const updatedAutomations = await client.getAutomations();
            const deletedAutomation = updatedAutomations.find((a) => a.attributes.id === createdAutomation.attributes.id);
            expect(deletedAutomation).toBeUndefined();
        }
    });

    it("should report connection status", async () => {
        const client = await HASSClient.create(config);
        expect(client.isConnected()).toBe(true);
    });

    it("should fetch entities by prefix", async () => {
        const client = await HASSClient.create(config);
        const sensorEntities = await client.getEntitiesByPrefix("sensor.");
        expect(Array.isArray(sensorEntities)).toBe(true);
        if (sensorEntities.length > 0) {
            expect(sensorEntities[0].entityId.startsWith("sensor.")).toBe(true);
        }
    });

    it("should fetch device_id by entity_id", async () => {
        const client = await HASSClient.create(config);
        const device_id = await client.getDeviceIdByEntityId("light.bureau_ecran_gauche_lumiere");
        expect(device_id).toBeDefined();
        expect(device_id).toBe("5c66bfa53684b9d244b0626d198045dd");
    });

    it("should validate config", async () => {
        const client = await HASSClient.create(config);
        const configToValidate = {
            "triggers": [{ "trigger": "state", "entity_id": ["switch.bibliotheque_thermostat_child_lock"], "to": "on" }],
            "conditions": [],
            "actions": []
        };
        const res = await client.validateConfig(configToValidate)
        expect(res).toBeDefined();
        expect(res).toHaveProperty("triggers");
        expect(res).toHaveProperty("conditions");
        expect(res).toHaveProperty("actions");
        expect(res.triggers).toHaveProperty("valid");
        expect(res.conditions).toHaveProperty("valid");
        expect(res.actions).toHaveProperty("valid");
        expect(res.triggers!.valid).toBe(true);
        expect(res.conditions!.valid).toBe(true);
        expect(res.actions!.valid).toBe(true);
    });

    it("should validate minimal config", async () => {
        const client = await HASSClient.create(config);
        const configToValidate = {
            "triggers": [{ "trigger": "state", "entity_id": ["switch.bibliotheque_thermostat_child_lock"], "to": "on" }]
        };
        const res = await client.validateConfig(configToValidate)
        expect(res).toBeDefined();
        expect(res).toHaveProperty("triggers");
        expect(res).not.toHaveProperty("conditions");
        expect(res).not.toHaveProperty("actions");
        expect(res.triggers).toHaveProperty("valid");
        expect(res.triggers!.valid).toBe(true);
    });

    it("should fail with bad config", async () => {
        const client = await HASSClient.create(config);
        const configToValidate = {
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
        };
        await expect(client.validateConfig(configToValidate)).rejects.toThrow();
    });

    it("should fetch entities by regex", async () => {
        const client = await HASSClient.create(config);
        const regex = /^sensor\./;
        const entities = await client.getEntities(regex);
        expect(Array.isArray(entities)).toBe(true);
        if (entities.length > 0) {
            expect(regex.test(entities[0].entityId)).toBe(true);
        }
    });

    it("should get entity source by entity_id", async () => {
        const client = await HASSClient.create(config);
        const entityId = "switch.bibliotheque_thermostat_child_lock";
        const domain = await client.getEntityDomain(entityId);
        expect(domain).toBeDefined();
        expect(domain).toBe("mqtt");
    });

    it("should get dashboard config by url_path", async () => {
        const client = await HASSClient.create(config);
        const url_path = "tv-remote";
        const configResult = await client.getLovelaceConfig(url_path);
        expect(configResult).toBeDefined();
        expect(configResult).toHaveProperty("views");
    });

    it("should search related entities", async () => {
        const client = await HASSClient.create(config);
        const itemType = "area";
        const itemId = "studio";
        const relatedEntities = await client.searchRelatedEntities(itemType, itemId);
        expect(relatedEntities).toBeDefined();
    });

});
