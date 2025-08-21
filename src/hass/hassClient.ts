import {
    createConnection,
    Connection,
    getStates,
    createLongLivedTokenAuth,
    callService as hassCallService,
} from "home-assistant-js-websocket";
import { HASSConfig, EntityState, Automation, AutomationRest, AutomationCreateRest, EntityRegistry, ValidateConfigResponse, ValidateConfig, AutomationRestTrace, AutomationRestShort } from "./types.js";
// import { HassCollectionSubscriber } from "./hassCollectionSubscriber.js";

const RestApi = {
    Automation: "config/automation/config/",
    ConfigEntriesFlowOptions: "config/config_entries/options/flow",
    ConfigEntriesFlow: "config/config_entries/flow",
    ConfigEntriesFlowHandler: "config/config_entries/flow_handlers?type=helper",
    ConfigEntry: (id: string) => `config/config_entries/entry/${id}`
};

export class HASSClient {
    connection: Connection;
    private config: HASSConfig;

    // This just works with sendMessagePromise
    // private entitiesRegistry: HassCollectionSubscriber;

    /**
     * Private constructor. Use {@link HASSClient.create} to instantiate.
     * @param {Connection} connection - Home Assistant websocket connection.
     * @param {HASSConfig} config - Home Assistant configuration.
     */
    private constructor(connection: Connection, config: HASSConfig) {
        this.connection = connection;
        this.config = config;

        // This just works with sendMessagePromise
        // this.entitiesRegistry = new HassCollectionSubscriber(
        //     "config/entity_registry/list",
        //     connection
        // );
    }

    /**
     * Makes an HTTP request to the Home Assistant REST API.
     * @param {Object} params - The API call parameters.
     * @param {Object} [params.message] - Optional request body to send as JSON.
     * @param {string} params.api - API endpoint (relative to /api/).
     * @param {"POST"|"GET"|"DELETE"} [params.method="GET"] - HTTP method.
     * @returns {Promise<unknown>} Resolves with the parsed JSON response.
     * @throws {Error} If the API call fails (non-2xx response).
     * @example
     * await client.sendApiCall({ api: "config/automation/config/123", method: "GET" });
     */
    async sendApiCall(params: {
        message?: object,
        api: string,
        method?: "POST" | "GET" | "DELETE"
    }): Promise<unknown> {
        const { message, api, method = "GET" } = params;
        const response = await fetch(`${this.config.url}/api/${api}`, {
            method,
            headers: {
                "Authorization": `Bearer ${this.config.accessToken}`,
                "Content-Type": "application/json",
            },
            body: message ? JSON.stringify(message) : undefined,
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API call failed: ${response.statusText} - ${errorText}`);
        }
        return response.json();
    }

    /**
     * Creates and connects a new HASSClient instance.
     * @param {HASSConfig} config - Home Assistant configuration.
     * @returns {Promise<HASSClient>} Resolves with a connected client.
     * @throws {Error} If connection fails.
     */
    static async create(config: HASSConfig): Promise<HASSClient> {
        try {
            const auth = createLongLivedTokenAuth(config.url, config.accessToken);
            const connection = await createConnection({ auth });
            if (config.debugMode) {
                console.log("Connected to Home Assistant");
            }
            return new HASSClient(connection, config);
        } catch (error) {
            throw new Error("Connection failed");
        }
    }

    /**
     * Retrieves all entity states from Home Assistant.
     * @returns {Promise<EntityState[]>} Resolves with an array of entity states.
     */
    async getStates(): Promise<EntityState[]> {
        const states = await getStates(this.connection);
        return states.map((state) => ({
            entityId: state.entity_id,
            state: state.state,
            attributes: state.attributes,
            lastChanged: state.last_changed,
            lastUpdated: state.last_updated,
            context: state.context,
        }));
    }

    /**
     * Finds an automation entity by its entity ID.
     * @param {string} entityId - The entity ID (with or without "automation." prefix).
     * @returns {Promise<Automation|undefined>} Resolves with the automation or undefined if not found.
     */
    async getAutomationByEntityId(entityId: string): Promise<Automation | undefined> {
        const states = await this.getStates();
        const automationStates = states.filter((state) => state.entityId.startsWith("automation."));
        return automationStates.find((state) => state.entityId === `automation.${entityId.replace(/^automation\./, "")}`) as Automation | undefined;
    }

    /**
     * Retrieves all automation entities.
     * @returns {Promise<Automation[]>} Resolves with an array of automations.
     */
    async getAutomations(): Promise<Automation[]> {
        return (await this.getStates()).filter((state) => state.entityId.startsWith("automation.")) as Automation[];
    }

    /**
     * Creates a new automation via the Home Assistant REST API.
     * @param {AutomationCreateRest} automation - The automation definition.
     * @returns {Promise<string>} Resolves with the new automation's REST ID.
     * @throws {Error} If the API call fails.
     */
    async createAutomationREST(
        automation: AutomationCreateRest,
    ): Promise<string> {
        const newAutomation: AutomationRest = automation as AutomationRest;
        newAutomation.id = Date.now().toString();
        await this.sendApiCall({
            message: newAutomation,
            api: `${RestApi.Automation}${newAutomation.id}`,
            method: "POST"
        });
        return newAutomation.id;
    }

    /**
     * Deletes an automation via the Home Assistant REST API.
     * @param {string} id - The REST ID of the automation to delete.
     * @returns {Promise<void>} Resolves when deletion is complete.
     * @throws {Error} If the API call fails.
     */
    async deleteAutomationREST(id: string): Promise<void> {
        await this.sendApiCall({
            api: `${RestApi.Automation}${id}`,
            method: "DELETE"
        });
    }

    /**
     * Updates an existing automation via the Home Assistant REST API.
     * @param {AutomationRest} message - The updated automation definition (must include id).
     * @returns {Promise<void>} Resolves when update is complete.
     * @throws {Error} If the API call fails.
     */
    async updateAutomationREST(message: AutomationRest): Promise<void> {
        await this.sendApiCall({
            message,
            api: `${RestApi.Automation}${message.id}`,
            method: "POST"
        });
    }

    /**
     * Retrieves an automation definition from the Home Assistant REST API.
     * @param {string} id - The REST ID of the automation.
     * @returns {Promise<AutomationRest>} Resolves with the automation definition.
     * @throws {Error} If the API call fails.
     */
    async getAutomationREST(id: string): Promise<AutomationRest> {
        return this.sendApiCall({
            api: `${RestApi.Automation}${id}`,
        }) as Promise<AutomationRest>;
    }

    /**
     * Finds an automation entity by its REST API ID.
     * @param {string} restId - The REST ID of the automation.
     * @returns {Promise<Automation>} Resolves with the automation entity.
     * @throws {Error} If no automation with the given ID is found.
     */
    async getAutomationByRestId(restId: string): Promise<Automation> {
        const automation = await this.getAutomations();
        const foundAutomation = automation.find((a) => a.attributes.id === restId);
        if (!foundAutomation) {
            throw new Error(`Automation with id ${restId} not found`);
        }
        return foundAutomation;
    }

    /**
     * Retrieves an automation's REST definition by its entity ID.
     * @param {string} entityId - The entity ID of the automation.
     * @returns {Promise<AutomationRest>} Resolves with the automation's REST definition.
     * @throws {Error} If the automation or its ID is not found.
     */
    async getAutomationRestByEntityId(entityId: string): Promise<AutomationRest> {
        const automation = await this.getAutomationByEntityId(entityId);
        if (!automation || !automation.attributes?.id) {
            throw new Error(`Automation state or id not found for entity: ${entityId}`);
        }
        return this.getAutomationREST(automation.attributes.id);
    }

    /**
     * Creates a new automation (alias for createAutomationREST).
     * @param {AutomationCreateRest} automationCreateRest - The automation definition.
     * @returns {Promise<string>} Resolves with the new automation's REST ID.
     * @throws {Error} If the API call fails.
     */
    async createAutomation(automationCreateRest: AutomationCreateRest): Promise<string> {
        return await this.createAutomationREST(automationCreateRest);
    }

    /**
     * Deletes an automation by its entity ID.
     * @param {string} entityId - The entity ID of the automation.
     * @returns {Promise<void>} Resolves when deletion is complete.
     * @throws {Error} If the automation or its ID is not found.
     */
    async deleteAutomation(entityId: string): Promise<void> {
        const state = await this.getAutomationByEntityId(entityId);
        if (!state || !state.attributes?.id) {
            throw new Error(`Automation state or id not found for entity: ${entityId}`);
        }
        await this.deleteAutomationREST(state.attributes.id);
    }

    /**
     * Updates an automation by its entity ID.
     * @param {string} entityId - The entity ID of the automation.
     * @param {AutomationRest} automation - The updated automation definition.
     * @returns {Promise<void>} Resolves when update is complete.
     * @throws {Error} If the automation or its ID is not found.
     */
    async updateAutomation(entityId: string, automation: AutomationRest): Promise<void> {
        const state = await this.getAutomationByEntityId(entityId);
        if (!state || !state.attributes?.id) {
            throw new Error(`Automation state or id not found for entity: ${entityId}`);
        }
        automation.id = state.attributes.id;
        await this.updateAutomationREST(automation);
    }

    /**
     * Calls a Home Assistant service.
     * @param {string} domain - The service domain (e.g., "light").
     * @param {string} service - The service name (e.g., "turn_on").
     * @param {Record<string, unknown>} [data] - Optional service data.
     * @returns {Promise<void>} Resolves when the service call is complete.
     * @throws {Error} If the service call fails.
     */
    async callService(
        domain: string,
        service: string,
        data?: Record<string, unknown>,
    ): Promise<void> {
        await hassCallService(this.connection, domain, service, data);
    }

    /**
     * Checks if the client is connected to Home Assistant.
     * @returns {boolean} True if connected, false otherwise.
     */
    isConnected(): boolean {
        return !!this.connection?.connected;
    }

    /**
     * Retrieves all entities matching a specific prefix.
     * @param {string} prefix - The entity ID prefix (e.g., "sensor.").
     * @returns {Promise<EntityState[]>} Resolves with an array of matching entities.
     */
    async getEntitiesByPrefix(prefix: string): Promise<EntityState[]> {
        const states = await this.getStates();
        return states.filter((state) => state.entityId.startsWith(prefix));
    }
    /**
         * Retrieves all entities matching a regex pattern.
         * @param {RegExp} regex - The regex to match entity IDs.
         * @returns {Promise<EntityState[]>} Resolves with an array of matching entities.
         */
    async getEntities(regex: RegExp): Promise<EntityState[]> {
        const states = await this.getStates();
        return states.filter((state) => regex.test(state.entityId));
    }

    async getEntitiesRegistry(): Promise<EntityRegistry[]> {
        // return (await this.entitiesRegistry.getItems()) as EntityRegistry[];
        return await this.connection.sendMessagePromise({
            type: "config/entity_registry/list",
        }) as EntityRegistry[];
    }

    async getEntityRegistryByEntityId(entity_id: string): Promise<EntityRegistry | null | undefined> {
        return await this.connection.sendMessagePromise({
            type: "config/entity_registry/get",
            entity_id,
        }) as EntityRegistry | null | undefined;
    }

    async getDeviceIdByEntityId(entityId: string): Promise<string | null | undefined> {
        const entityRegistry = await this.getEntityRegistryByEntityId(entityId);
        return entityRegistry?.device_id;
    }

    async getConfigEntryIdByEntityId(entityId: string): Promise<string | null | undefined> {
        const entityRegistry = await this.getEntityRegistryByEntityId(entityId);
        return entityRegistry?.config_entry_id;
    }

    async validateConfig(config: ValidateConfig): Promise<ValidateConfigResponse> {
        return await this.connection.sendMessagePromise({
            type: "validate_config",
            ...config,
        });
    }

    async getAutomationTrace(automationRestId: string, run_id: string): Promise<AutomationRestTrace | undefined> {
        return await this.connection.sendMessagePromise({
            type: "trace/get",
            domain: "automation",
            item_id: automationRestId,
            run_id
        });
    }

    async listAutomationTraces(automationRestId: string): Promise<AutomationRestShort[] | undefined> {
        return await this.connection.sendMessagePromise({
            type: "trace/list",
            domain: "automation",
            item_id: automationRestId
        });
    }

    async listEntitiesSource(): Promise<Record<string, Record<string, string>>> {
        return await this.connection.sendMessagePromise({
            type: "entity/source",
        });
    }

    async getEntityDomain(entityId: string): Promise<string | undefined> {
        const sources = await this.listEntitiesSource();
        return sources[entityId]?.domain;
    }

    async getManifest(integration: string): Promise<Record<string, unknown>> {
        return await this.connection.sendMessagePromise({
            type: "manifest/get",
            integration
        });
    }

    async updateLovelaceConfig(url_path: string, config: Record<string, unknown>): Promise<void> {
        await this.connection.sendMessagePromise({
            type: "lovelace/config/save",
            url_path,
            config
        });
    }

    async getLovelaceResources(): Promise<void> {
        await this.connection.sendMessagePromise({
            type: "lovelace/resources"
        });
    }

    async getLovelaceConfig(url_path: string, force = false): Promise<Record<string, unknown>> {
        return await this.connection.sendMessagePromise({
            type: "lovelace/config",
            url_path,
            force
        });
    }

    async listLovelaceDashboards(): Promise<Record<string, unknown>[]> {
        return await this.connection.sendMessagePromise({
            type: "lovelace/dashboards/list"
        });
    }

    async createLovelaceDashboard(title: string, url_path: string, require_admin = false, show_in_sidebar = true): Promise<void> {
        await this.connection.sendMessagePromise({
            mode: "storage",
            require_admin,
            show_in_sidebar,
            title,
            type: "lovelace/dashboards/create",
            url_path
        });
    }

    async deleteLovelaceDashboard(dashboard_id: string): Promise<void> {
        await this.connection.sendMessagePromise({
            type: "lovelace/dashboards/delete",
            dashboard_id
        });
    }

    async updateDeviceRegistry(device_id: string, device_config: { area_id?: string, [key: string]: unknown }) {
        await this.connection.sendMessagePromise({
            type: "config/device_registry/update",
            device_id,
            ...device_config
        });
    }

    async createConfigEntryOptionsFlowREST(config_entry_id: string) {
        return this.sendApiCall({
            method: "POST",
            message: {
                handler: config_entry_id,
                show_advanced_options: true,
            },
            api: `${RestApi.ConfigEntriesFlowOptions}`,
        });
    }

    async updateConfigEntryOptionsFlowREST(flow_id: string, options: Record<string, unknown>) {
        return this.sendApiCall({
            method: "POST",
            message: {
                ...options
            },
            api: `${RestApi.ConfigEntriesFlowOptions}/${flow_id}`,
        });
    }

    async continueConfigEntryFlowREST(flow_id: string, next_step_id: string) {
        return this.sendApiCall({
            method: "POST",
            message: {
                next_step_id
            },
            api: `${RestApi.ConfigEntriesFlow}/${flow_id}`,
        });
    }

    async createConfigEntryFlowREST(handler: string) {
        return this.sendApiCall({
            method: "POST",
            message: {
                handler,
                show_advanced_options: true,
            },
            api: `${RestApi.ConfigEntriesFlow}`,
        });
    }

    async updateConfigEntryFlowREST(
        flow_id: string,
        options: Record<string, unknown>
    ) {
        return this.sendApiCall({
            method: "POST",
            message: {
                ...options,
            },
            api: `${RestApi.ConfigEntriesFlow}/${flow_id}`,
        });
    }

    async deleteConfigEntryRest(config_entry_id: string) {
        await this.sendApiCall({
            api: RestApi.ConfigEntry(config_entry_id),
            method: "DELETE",
            message: {
                require_restart: false
            }
        });
    }

    async getConfigEntriesFlowHandler(): Promise<Record<string, unknown>> {
        return this.sendApiCall({
            api: RestApi.ConfigEntriesFlowHandler,
            method: "GET"
        }) as Promise<Record<string, unknown>>;
    }

    async listDeviceAutomationTriggers(device_id: string): Promise<Record<string, unknown>[]> {
        return await this.connection.sendMessagePromise({
            type: "device_automation/trigger/list",
            device_id
        });
    }

    async listAreas(): Promise<Record<string, unknown>[]> {
        return await this.connection.sendMessagePromise({
            type: "config/area_registry/list"
        });
    }

    async searchRelatedEntities(item_type: string, item_id: string): Promise<object> {
        return await this.connection.sendMessagePromise({
            type: "search/related",
            item_type,
            item_id
        });
    }

}
