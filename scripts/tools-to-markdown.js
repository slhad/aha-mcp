#!/usr/bin/env node

import { readFileSync, writeFileSync, unlinkSync } from 'fs';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { encoding_for_model } from 'tiktoken';

async function countTokens(str, model = "gpt-4.1") {
    const enc = encoding_for_model(model);
    const tokens = enc.encode(str);
    const count = tokens.length;
    enc.free();
    return count;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to extract required parameters from inputSchema
function extractRequiredParams(inputSchema) {
    if (!inputSchema || !inputSchema.properties) return [];
    const required = inputSchema.required || [];
    return required.map(param => {
        const property = inputSchema.properties[param];
        return {
            name: param,
            type: property.type || 'unknown',
            description: property.description || ''
        };
    });
}

// Function to extract optional parameters
function extractOptionalParams(inputSchema) {
    if (!inputSchema || !inputSchema.properties) return [];
    const required = inputSchema.required || [];
    return Object.entries(inputSchema.properties)
        .filter(([key]) => !required.includes(key))
        .map(([key, property]) => ({
            name: key,
            type: property.type || 'unknown',
            description: property.description || ''
        }));
}

// Function to format parameters for table display
function formatParams(params) {
    if (params.length === 0) return 'None';
    return params.map(p => `\`${p.name}\` (${p.type}): ${p.description}`).join('<br>');
}

// Function to escape markdown characters in text
function escapeMarkdown(text) {
    if (!text) return '';
    return text.replace(/\|/g, '\\|').replace(/\n/g, ' ').replace(/\r/g, '');
}

try {
    // Read tools.json
    const toolsPath = join(__dirname, '..', 'tools.json');
    const toolsData = JSON.parse(readFileSync(toolsPath, 'utf8'));

    if (!toolsData.tools || !Array.isArray(toolsData.tools)) {
        throw new Error('Invalid tools.json format: expected "tools" array');
    }


    // Generate markdown content
    let markdownContent = `# Home Assistant MCP Server Tools

This document lists all available tools in the Home Assistant MCP Server.

**Total Tools:** ${toolsData.tools.length}

## Tools Overview

| ~ Tokens | Tool Name | Title | Description | Required Parameters | Optional Parameters |
|----------|-----------|-------|-------------|---------------------|---------------------|
`;


    for (const tool of toolsData.tools) {
        const requiredParams = extractRequiredParams(tool.inputSchema);
        const optionalParams = extractOptionalParams(tool.inputSchema);

        // Count tokens for the tool declaration (as JSON)
        const toolJson = JSON.stringify(tool);
        let tokenCount = 0;
        try {
            tokenCount = await countTokens(toolJson);
        } catch (e) {
            tokenCount = 'ERR';
        }

        const row = [
            tokenCount,
            `\`${escapeMarkdown(tool.name)}\``,
            escapeMarkdown(tool.title || ''),
            escapeMarkdown(tool.description || ''),
            formatParams(requiredParams),
            formatParams(optionalParams)
        ].join(' | ');

        markdownContent += `| ${row} |\n`;
    }

    // Add detailed section
    markdownContent += `\n## Detailed Tool Descriptions\n\n`;

    toolsData.tools.forEach(tool => {
        markdownContent += `### ${escapeMarkdown(tool.title || tool.name)}\n\n`;
        markdownContent += `**Name:** \`${tool.name}\`\n\n`;

        if (tool.description) {
            markdownContent += `**Description:** ${escapeMarkdown(tool.description)}\n\n`;
        }

        const requiredParams = extractRequiredParams(tool.inputSchema);
        const optionalParams = extractOptionalParams(tool.inputSchema);

        if (requiredParams.length > 0) {
            markdownContent += `**Required Parameters:**\n`;
            requiredParams.forEach(param => {
                markdownContent += `- \`${param.name}\` (${param.type}): ${escapeMarkdown(param.description)}\n`;
            });
            markdownContent += `\n`;
        }

        if (optionalParams.length > 0) {
            markdownContent += `**Optional Parameters:**\n`;
            optionalParams.forEach(param => {
                markdownContent += `- \`${param.name}\` (${param.type}): ${escapeMarkdown(param.description)}\n`;
            });
            markdownContent += `\n`;
        }

        markdownContent += `---\n\n`;
    });

    // Write tools.md
    const outputPath = join(__dirname, '..', 'tools.md');
    writeFileSync(outputPath, markdownContent, 'utf8');

    // Clean up tools.json file
    try {
        unlinkSync(toolsPath);
        console.log(`🧹 Cleaned up temporary tools.json file`);
    } catch (cleanupError) {
        console.warn(`⚠️  Could not delete tools.json: ${cleanupError.message}`);
    }

    console.log(`✅ Successfully generated tools.md with ${toolsData.tools.length} tools`);
    console.log(`📄 Output file: ${outputPath}`);

} catch (error) {
    console.error('❌ Error generating tools.md:', error.message);
    process.exit(1);
}
