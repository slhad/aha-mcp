import { HomeAssistantMCPServer } from "./server/homeAssistantMcpServer.js";
import { HASSConfig } from "./hass/types.js";
import express, { Request, Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { randomUUID } from "node:crypto";
import cors from "cors";


export async function startStreamableHttpServer(config: HASSConfig) {
    const app = express();
    app.use(express.json());

    const mcpServer = new HomeAssistantMCPServer(config);

    const transports: Record<string, StreamableHTTPServerTransport> = {};

    app.post("/mcp", async (req: Request, res: Response) => {
        const sessionId = req.headers["mcp-session-id"] as string | undefined;
        let transport: StreamableHTTPServerTransport;
        if (sessionId && transports[sessionId]) {
            transport = transports[sessionId];
        } else {
            transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: () => randomUUID(),
                onsessioninitialized: (sid: string) => {
                    transports[sid] = transport;
                },
            });
            transport.onclose = () => {
                if (transport.sessionId) delete transports[transport.sessionId];
            };
            await mcpServer.getServer().connect(transport);
        }
        await transport.handleRequest(req, res, req.body);
    });

    app.get("/mcp", async (req: Request, res: Response) => {
        const sessionId = req.headers["mcp-session-id"] as string | undefined;
        if (!sessionId || !transports[sessionId]) {
            res.status(400).send("Invalid or missing session ID");
            return;
        }
        const transport = transports[sessionId];
        await transport.handleRequest(req, res);
    });

    app.delete("/mcp", async (req: Request, res: Response) => {
        const sessionId = req.headers["mcp-session-id"] as string | undefined;
        if (!sessionId || !transports[sessionId]) {
            res.status(400).send("Invalid or missing session ID");
            return;
        }
        const transport = transports[sessionId];
        await transport.handleRequest(req, res);
    });

    app.use(cors({
        origin: '*',
        exposedHeaders: ['mcp-session-id'],
        allowedHeaders: ['Content-Type', 'mcp-session-id'],
    }));

    app.listen(config.port, () => {
        console.log(`MCP Streamable HTTP Server listening on port ${config.port}`);
    });
}

export async function startSseServer(config: HASSConfig) {
    const app = express();
    app.use(express.json());

    const mcpServer = new HomeAssistantMCPServer(config);
    const transports: Record<string, SSEServerTransport> = {};

    app.get("/sse", async (req: Request, res: Response) => {
        const transport = new SSEServerTransport("/messages", res);
        transports[transport.sessionId] = transport;
        res.on("close", () => {
            delete transports[transport.sessionId];
        });
        await mcpServer.getServer().connect(transport);
    });

    app.post("/messages", async (req: Request, res: Response) => {
        const sessionId = req.query.sessionId as string | undefined;
        const transport = sessionId ? transports[sessionId] : undefined;
        if (transport) {
            await transport.handlePostMessage(req, res, req.body);
        } else {
            res.status(400).send("No transport found for sessionId");
        }
    });

    app.listen(config.port, () => {
        console.log(`MCP SSE Server listening on port ${config.port}`);
    });
}
