# Home Assistant MCP Server Tools

This document lists all available tools in the Home Assistant MCP Server.

**Total Tools:** 38

## Tools Overview

| Tool Name | Title | Description | Required Parameters | Optional Parameters |
|-----------|-------|-------------|-------------------|-------------------|
| `get-rest-automation-trace` | Get automation trace by rest_id and run_id | Fetches the trace for a specific automation run using its REST id and run id. | `rest_id` (string): Automation REST API id<br>`run_id` (string): Automation run id | None |
| `list-rest-automation-traces` | List automation traces by rest_id | List all traces for a specific automation using its REST id. | `rest_id` (string): Automation REST API id | None |
| `list-automations` | List all automations | List all automations | None | None |
| `delete-automation` | Delete an automation | Delete an automation by id | `id` (string): Automation unique ID | None |
| `get-automation-by-entity-id` | Get automation by entity_id | Find an automation entity using its entity_id (e.g. automation.my_automation). | `entity_id` (string): Automation entity_id, e.g. 'automation.my_automation' | None |
| `get-rest-automation-by-entity-id` | Get REST automation by entity_id | Get an automation's REST definition using its entity_id (e.g. automation.my_automation). | `entity_id` (string): Automation entity_id, e.g. 'automation.my_automation' | None |
| `update-automation-by-entity-id` | Update automation by entity_id | Update an automation using its entity_id (e.g. automation.my_automation). | `entity_id` (string): Automation entity_id, e.g. 'automation.my_automation'<br>`automation` (object): {"type":"object","properties":{"id":{"type":"string"},"alias":{"type":"string"},"description":{"type":"string"},"triggers":{"type":"array","items":{}},"conditions":{"type":"array","items":{}},"actions":{"type":"array","items":{}},"mode":{"type":"string","enum":["single","parallel","queued","restart"]}},"required":["id","alias","description","triggers","conditions","actions","mode"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"} | None |
| `get-automation-by-rest-id` | Get automation by rest_id | Find an automation entity using its REST API id (rest_id, not entity_id). | `rest_id` (string): Automation REST API id | None |
| `get-rest-automation-by-rest-id` | Get REST automation by rest_id | Get an automation's REST definition using its rest_id (REST API id, not entity_id). | `rest_id` (string): Automation REST API id | None |
| `update-rest-automation-by-rest-id` | Update REST automation by rest_id | Update an automation using its rest_id (REST API id, not entity_id). | `automation` (object): {"type":"object","properties":{"id":{"type":"string"},"alias":{"type":"string"},"description":{"type":"string"},"triggers":{"type":"array","items":{}},"conditions":{"type":"array","items":{}},"actions":{"type":"array","items":{}},"mode":{"type":"string","enum":["single","parallel","queued","restart"]}},"required":["id","alias","description","triggers","conditions","actions","mode"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"} | None |
| `delete-rest-automation-by-rest-id` | Delete REST automation by rest_id | Delete an automation using its rest_id (REST API id, not entity_id). | `rest_id` (string): Automation REST API id | None |
| `create-rest-automation` | Create REST automation | Create a new automation via the Home Assistant REST API. Returns the new rest_id. | `automation` (object): {"type":"object","properties":{"alias":{"type":"string"},"description":{"type":"string"},"triggers":{"type":"array","items":{}},"conditions":{"type":"array","items":{}},"actions":{"type":"array","items":{}},"mode":{"type":"string","enum":["single","parallel","queued","restart"]}},"required":["alias","description","triggers","conditions","actions","mode"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"} | None |
| `list-device-automation-triggers` | List device automation triggers | List all triggers for a specific device's automations. | `device_id` (string): Device ID | None |
| `get-status` | Get Home Assistant connection status | Get Home Assistant connection status | None | None |
| `validate-config` | Validate triggers, conditions and actions for any automation change | Validate triggers, conditions and actions configurations as if part of an automation. Any changes to automation should be checked with this tool | `config` (object): {"type":"object","properties":{"triggers":{"type":"array","items":{}},"conditions":{"type":"array","items":{}},"actions":{"type":"array","items":{}}},"additionalProperties":false} | None |
| `call-service` | Call a Home Assistant service | Call a Home Assistant service | `domain` (string): Service domain (e.g., light, switch)<br>`service` (string): Service name | `data` (object):  |
| `get-manifest` | Get Home Assistant integration manifest | Get the manifest of a Home Assistant integration | `integration` (string): Integration name, e.g. 'light' | None |
| `get-entity-registry-by-entity-id` | Get entity registry by entity_id | Get registry info for a specific entity_id | `entityId` (string): Entity ID, e.g. 'sensor.temperature' | None |
| `get-device-id-by-entity-id` | Get device_id by entity_id | Get the device_id for a given entity_id | `entityId` (string): Entity ID, e.g. 'sensor.temperature' | None |
| `get-config-entry-id-by-entity-id` | Get config_entry_id by entity_id | Get the config_entry_id for a given entity_id | `entityId` (string): Entity ID, e.g. 'sensor.temperature' | None |
| `update-device-registry` | Update device registry | Update the device registry for a specific device_id | `device_id` (string): Device ID, e.g. 'device_123'<br>`device_config` (object): Any field device configuration to update | None |
| `create-config-entry-flow` | Create config entry flow with a handler | Create a new config entry in the Home Assistant entity registry | `handler` (string): The handler for the config entry flow | None |
| `continue-config-entry-flow` | Continue config entry flow | Continue an existing config entry flow with a next step Id | `flow_id` (string): The ID of the config entry flow to continue<br>`next_step_id` (string): The ID of the next step to execute | None |
| `finish-config-entry-flow` | Finish config entry flow | Finish an existing config entry flow | `flow_id` (string): The ID of the config entry flow to finish<br>`options` (object): Parameters to finish the flow | None |
| `create-config-entry-options-flow` | Create config entry options flow for a config entry id | Create a new config entry options flow for a specific config entry | `config_entry_id` (string): The ID of the config entry to create options flow for | None |
| `update-config-entry-options-flow` | Update config entry options flow | Update an existing config entry options flow | `flow_id` (string): The ID of the config entry flow to update<br>`options` (object): Parameters to update the flow | None |
| `list-entities-by-prefix` | List all entities by prefix | List all Home Assistant entities by prefix | `prefix` (string): Prefix to filter entities, e.g. 'sensor.' | None |
| `list-entities-by-regex` | List all entities by regex | List all Home Assistant entities matching a regex pattern | `pattern` (string): Regex pattern for entity IDs, e.g. '^sensor\.'<br>`flags` (string): Regex flags, e.g. 'i' for ignore case | None |
| `get-entity-state` | Get state of a specific entity | Get state of a specific entity_id | `entityId` (string): Entity ID, e.g. 'sensor.temperature' | None |
| `get-entity-domain` | Get domain of a specific entity | Get domain of a specific entity_id | `entityId` (string): Entity ID, e.g. 'sensor.temperature' | None |
| `search-related` | Search related entities | Search for entities related to a specific item_type (like 'area') and entity_id (like 'studio') | `itemType` (string): Type of the item, e.g. 'entity', 'area'<br>`itemId` (string): ID of the item, e.g. 'sensor.temperature' or 'area.living_room' | None |
| `list-area` | List all areas | List all Home Assistant areas | None | None |
| `get-lovelace-config` | Get Lovelace Config | Fetch Lovelace dashboard config by url_path. The URL must contain a dash ('-') and must not contain spaces or special characters, except '_' and '-' | `url_path` (string): The URL path of the Lovelace dashboard config to fetch, e.g., 'default-view' or 'dashboard-id' 
The URL must contain a dash ('-') and must not contain spaces or special characters, except '_' and '-' | `force` (boolean):  |
| `update-lovelace-config` | Update Lovelace Config | Update Lovelace dashboard config by url_path. | `url_path` (string): <br>`config` (object):  | None |
| `list-lovelace-dashboards` | List Lovelace Dashboards | List all Lovelace dashboards. | None | None |
| `create-lovelace-dashboard` | Create Lovelace Dashboard | Create a new Lovelace dashboard. | `title` (string): <br>`url_path` (string): The URL must contain a dash ('-') and must not contain spaces or special characters, except '_' and '-' | `require_admin` (boolean): <br>`show_in_sidebar` (boolean):  |
| `delete-lovelace-dashboard` | Delete Lovelace Dashboard | Delete a Lovelace dashboard by dashboard_id. | `dashboard_id` (string):  | None |
| `get-lovelace-resources` | Get Lovelace Resources | Fetch Lovelace resources. | None | None |

## Detailed Tool Descriptions

### Get automation trace by rest_id and run_id

**Name:** `get-rest-automation-trace`

**Description:** Fetches the trace for a specific automation run using its REST id and run id.

**Required Parameters:**
- `rest_id` (string): Automation REST API id
- `run_id` (string): Automation run id

---

### List automation traces by rest_id

**Name:** `list-rest-automation-traces`

**Description:** List all traces for a specific automation using its REST id.

**Required Parameters:**
- `rest_id` (string): Automation REST API id

---

### List all automations

**Name:** `list-automations`

**Description:** List all automations

---

### Delete an automation

**Name:** `delete-automation`

**Description:** Delete an automation by id

**Required Parameters:**
- `id` (string): Automation unique ID

---

### Get automation by entity_id

**Name:** `get-automation-by-entity-id`

**Description:** Find an automation entity using its entity_id (e.g. automation.my_automation).

**Required Parameters:**
- `entity_id` (string): Automation entity_id, e.g. 'automation.my_automation'

---

### Get REST automation by entity_id

**Name:** `get-rest-automation-by-entity-id`

**Description:** Get an automation's REST definition using its entity_id (e.g. automation.my_automation).

**Required Parameters:**
- `entity_id` (string): Automation entity_id, e.g. 'automation.my_automation'

---

### Update automation by entity_id

**Name:** `update-automation-by-entity-id`

**Description:** Update an automation using its entity_id (e.g. automation.my_automation).

**Required Parameters:**
- `entity_id` (string): Automation entity_id, e.g. 'automation.my_automation'
- `automation` (object): {"type":"object","properties":{"id":{"type":"string"},"alias":{"type":"string"},"description":{"type":"string"},"triggers":{"type":"array","items":{}},"conditions":{"type":"array","items":{}},"actions":{"type":"array","items":{}},"mode":{"type":"string","enum":["single","parallel","queued","restart"]}},"required":["id","alias","description","triggers","conditions","actions","mode"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}

---

### Get automation by rest_id

**Name:** `get-automation-by-rest-id`

**Description:** Find an automation entity using its REST API id (rest_id, not entity_id).

**Required Parameters:**
- `rest_id` (string): Automation REST API id

---

### Get REST automation by rest_id

**Name:** `get-rest-automation-by-rest-id`

**Description:** Get an automation's REST definition using its rest_id (REST API id, not entity_id).

**Required Parameters:**
- `rest_id` (string): Automation REST API id

---

### Update REST automation by rest_id

**Name:** `update-rest-automation-by-rest-id`

**Description:** Update an automation using its rest_id (REST API id, not entity_id).

**Required Parameters:**
- `automation` (object): {"type":"object","properties":{"id":{"type":"string"},"alias":{"type":"string"},"description":{"type":"string"},"triggers":{"type":"array","items":{}},"conditions":{"type":"array","items":{}},"actions":{"type":"array","items":{}},"mode":{"type":"string","enum":["single","parallel","queued","restart"]}},"required":["id","alias","description","triggers","conditions","actions","mode"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}

---

### Delete REST automation by rest_id

**Name:** `delete-rest-automation-by-rest-id`

**Description:** Delete an automation using its rest_id (REST API id, not entity_id).

**Required Parameters:**
- `rest_id` (string): Automation REST API id

---

### Create REST automation

**Name:** `create-rest-automation`

**Description:** Create a new automation via the Home Assistant REST API. Returns the new rest_id.

**Required Parameters:**
- `automation` (object): {"type":"object","properties":{"alias":{"type":"string"},"description":{"type":"string"},"triggers":{"type":"array","items":{}},"conditions":{"type":"array","items":{}},"actions":{"type":"array","items":{}},"mode":{"type":"string","enum":["single","parallel","queued","restart"]}},"required":["alias","description","triggers","conditions","actions","mode"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}

---

### List device automation triggers

**Name:** `list-device-automation-triggers`

**Description:** List all triggers for a specific device's automations.

**Required Parameters:**
- `device_id` (string): Device ID

---

### Get Home Assistant connection status

**Name:** `get-status`

**Description:** Get Home Assistant connection status

---

### Validate triggers, conditions and actions for any automation change

**Name:** `validate-config`

**Description:** Validate triggers, conditions and actions configurations as if part of an automation. Any changes to automation should be checked with this tool

**Required Parameters:**
- `config` (object): {"type":"object","properties":{"triggers":{"type":"array","items":{}},"conditions":{"type":"array","items":{}},"actions":{"type":"array","items":{}}},"additionalProperties":false}

---

### Call a Home Assistant service

**Name:** `call-service`

**Description:** Call a Home Assistant service

**Required Parameters:**
- `domain` (string): Service domain (e.g., light, switch)
- `service` (string): Service name

**Optional Parameters:**
- `data` (object): 

---

### Get Home Assistant integration manifest

**Name:** `get-manifest`

**Description:** Get the manifest of a Home Assistant integration

**Required Parameters:**
- `integration` (string): Integration name, e.g. 'light'

---

### Get entity registry by entity_id

**Name:** `get-entity-registry-by-entity-id`

**Description:** Get registry info for a specific entity_id

**Required Parameters:**
- `entityId` (string): Entity ID, e.g. 'sensor.temperature'

---

### Get device_id by entity_id

**Name:** `get-device-id-by-entity-id`

**Description:** Get the device_id for a given entity_id

**Required Parameters:**
- `entityId` (string): Entity ID, e.g. 'sensor.temperature'

---

### Get config_entry_id by entity_id

**Name:** `get-config-entry-id-by-entity-id`

**Description:** Get the config_entry_id for a given entity_id

**Required Parameters:**
- `entityId` (string): Entity ID, e.g. 'sensor.temperature'

---

### Update device registry

**Name:** `update-device-registry`

**Description:** Update the device registry for a specific device_id

**Required Parameters:**
- `device_id` (string): Device ID, e.g. 'device_123'
- `device_config` (object): Any field device configuration to update

---

### Create config entry flow with a handler

**Name:** `create-config-entry-flow`

**Description:** Create a new config entry in the Home Assistant entity registry

**Required Parameters:**
- `handler` (string): The handler for the config entry flow

---

### Continue config entry flow

**Name:** `continue-config-entry-flow`

**Description:** Continue an existing config entry flow with a next step Id

**Required Parameters:**
- `flow_id` (string): The ID of the config entry flow to continue
- `next_step_id` (string): The ID of the next step to execute

---

### Finish config entry flow

**Name:** `finish-config-entry-flow`

**Description:** Finish an existing config entry flow

**Required Parameters:**
- `flow_id` (string): The ID of the config entry flow to finish
- `options` (object): Parameters to finish the flow

---

### Create config entry options flow for a config entry id

**Name:** `create-config-entry-options-flow`

**Description:** Create a new config entry options flow for a specific config entry

**Required Parameters:**
- `config_entry_id` (string): The ID of the config entry to create options flow for

---

### Update config entry options flow

**Name:** `update-config-entry-options-flow`

**Description:** Update an existing config entry options flow

**Required Parameters:**
- `flow_id` (string): The ID of the config entry flow to update
- `options` (object): Parameters to update the flow

---

### List all entities by prefix

**Name:** `list-entities-by-prefix`

**Description:** List all Home Assistant entities by prefix

**Required Parameters:**
- `prefix` (string): Prefix to filter entities, e.g. 'sensor.'

---

### List all entities by regex

**Name:** `list-entities-by-regex`

**Description:** List all Home Assistant entities matching a regex pattern

**Required Parameters:**
- `pattern` (string): Regex pattern for entity IDs, e.g. '^sensor\.'
- `flags` (string): Regex flags, e.g. 'i' for ignore case

---

### Get state of a specific entity

**Name:** `get-entity-state`

**Description:** Get state of a specific entity_id

**Required Parameters:**
- `entityId` (string): Entity ID, e.g. 'sensor.temperature'

---

### Get domain of a specific entity

**Name:** `get-entity-domain`

**Description:** Get domain of a specific entity_id

**Required Parameters:**
- `entityId` (string): Entity ID, e.g. 'sensor.temperature'

---

### Search related entities

**Name:** `search-related`

**Description:** Search for entities related to a specific item_type (like 'area') and entity_id (like 'studio')

**Required Parameters:**
- `itemType` (string): Type of the item, e.g. 'entity', 'area'
- `itemId` (string): ID of the item, e.g. 'sensor.temperature' or 'area.living_room'

---

### List all areas

**Name:** `list-area`

**Description:** List all Home Assistant areas

---

### Get Lovelace Config

**Name:** `get-lovelace-config`

**Description:** Fetch Lovelace dashboard config by url_path. The URL must contain a dash ('-') and must not contain spaces or special characters, except '_' and '-'

**Required Parameters:**
- `url_path` (string): The URL path of the Lovelace dashboard config to fetch, e.g., 'default-view' or 'dashboard-id'  The URL must contain a dash ('-') and must not contain spaces or special characters, except '_' and '-'

**Optional Parameters:**
- `force` (boolean): 

---

### Update Lovelace Config

**Name:** `update-lovelace-config`

**Description:** Update Lovelace dashboard config by url_path.

**Required Parameters:**
- `url_path` (string): 
- `config` (object): 

---

### List Lovelace Dashboards

**Name:** `list-lovelace-dashboards`

**Description:** List all Lovelace dashboards.

---

### Create Lovelace Dashboard

**Name:** `create-lovelace-dashboard`

**Description:** Create a new Lovelace dashboard.

**Required Parameters:**
- `title` (string): 
- `url_path` (string): The URL must contain a dash ('-') and must not contain spaces or special characters, except '_' and '-'

**Optional Parameters:**
- `require_admin` (boolean): 
- `show_in_sidebar` (boolean): 

---

### Delete Lovelace Dashboard

**Name:** `delete-lovelace-dashboard`

**Description:** Delete a Lovelace dashboard by dashboard_id.

**Required Parameters:**
- `dashboard_id` (string): 

---

### Get Lovelace Resources

**Name:** `get-lovelace-resources`

**Description:** Fetch Lovelace resources.

---

