// Vitest configuration for TypeScript + tsx runner

import { defineConfig } from 'vitest/config';

import fs from 'fs';
import path from 'path';

const hasRealConfig = fs.existsSync(path.join(__dirname, 'tests', 'hass-real-config.ts'));
process.env.USE_MOCKS = hasRealConfig ? "false" : "true";

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        setupFiles: ['./vitest.setup.ts'],
    }
});