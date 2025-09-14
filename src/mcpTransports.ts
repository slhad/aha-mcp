import { HomeAssistantMCPServer } from "./server/homeAssistantMcpServer.js";
import { HASSConfig } from "./hass/types.js";
import express, { Request, Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { randomUUID } from "node:crypto";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Server } from "@modelcontextprotocol/sdk/server";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8081;


export async function startStreamableHttpServer(config: HASSConfig) {
    const app = express();
    app.use(cors({
        origin: '*',
        exposedHeaders: ['mcp-session-id', 'mcp-protocol-version'],
        allowedHeaders: ['Content-Type', 'mcp-session-id', 'Authorization', 'mcp-protocol-version']
    }));
    app.use(express.json());

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
            await HomeAssistantMCPServer.getServer(transport.sessionId!, config).connect(transport);
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

    app.listen(PORT, () => {
        console.log(`MCP Streamable HTTP Server listening on port ${PORT}`);
    });
}

export async function startSSEServer(server: Server) {
    const app = express();
    app.use(express.json());

    let transport: SSEServerTransport;

    app.get("/sse", async (req: Request, res: Response) => {
        transport = new SSEServerTransport("/messages", res);
        await server.connect(transport);
    });

    app.post("/messages", async (req: Request, res: Response) => {
        if (transport) {
            await transport.handlePostMessage(req, res, req.body);
        } else {
            res.status(400).send("No transport found");
        }
    });

    app.listen(PORT, () => {
        console.log(`MCP SSE Server listening on port ${PORT}`);
    });
}
