import { vi } from "vitest";

if (process.env.USE_MOCKS === "true") {
    vi.mock("../src/hass/hassClient", async () => {
        const mockStates = [{ entityId: "sensor.test", state: "on" }];
        const mockAutomations = [
            { id: "test-id", alias: "Test Automation", trigger: [], action: [], enabled: true },
        ];
        return {
            HASSClient: {
                create: vi.fn().mockResolvedValue({}),
            },
        };
    });
}
