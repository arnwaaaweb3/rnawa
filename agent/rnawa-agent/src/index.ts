import { logger, type IAgentRuntime, type Project, type ProjectAgent } from '@elizaos/core';
import starterPlugin from './plugin.ts';
import { character } from './character.ts';

const sanitizeObject = (obj: any) => {
    const seen = new WeakSet(); // Pake WeakSet biar otomatis ke-garbage collect
    return JSON.parse(
        JSON.stringify(obj, (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return "[Circular]"; // Kasih penanda biar kita tau ada yang dipotong
                }
                seen.add(value);
            }
            return value;
        })
    );
};

const initCharacter = ({ runtime }: { runtime: IAgentRuntime }) => {
    logger.info(`Initializing character: ${character.name}`);

    // Akses adapter
    const adapter = (runtime as any).databaseAdapter;

    if (adapter && typeof adapter.createMemory === 'function') {
        const originalSave = adapter.createMemory;
        
        // Override dengan arrow function atau bind konteks
        adapter.createMemory = async function (...args: any[]) {
            // args[0] adalah 'memory' object
            args[0] = sanitizeObject(args[0]);
            return originalSave.apply(this, args);
        };
        logger.info('✅ Database Adapter patched against cyclic structures.');
    } else {
        logger.warn('⚠️ Database Adapter bypass: Not found or incompatible.');
    }
};

export const projectAgent: ProjectAgent = {
    character,
    init: async (runtime: IAgentRuntime) => await initCharacter({ runtime }),
    plugins: [starterPlugin], // Aktifkan plugin starternya kalau mau
};

const project: Project = {
    agents: [projectAgent],
};

export { character } from './character.ts';
export default project;