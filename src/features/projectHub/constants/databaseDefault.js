// src/features/projectHub/constants/databaseDefault.js
const databaseDefault = {
    overview: "",

    // One or more engines you use across environments
    engines: [
        { label: 'Primary OLTP', type: 'PostgreSQL', version: '15', host: '', port: 5432, dbName: '', user: '', url: '' }
    ],

    // Logical schemas/namespaces
    schemas: [
        { name: 'public', description: '' }
    ],

    // High-level entity registry (keep it practical; fields/indexes summarized)
    entities: [
        {
            name: 'Task',
            table: 'tasks',
            description: 'User task items',
            fields: [{ name: 'id', type: 'uuid', pk: true, nullable: false, default: '' }],
            indexes: [{ name: 'tasks_pkey', columns: 'id', type: 'PRIMARY' }]
        }
    ],

    // Foreign-key or conceptual relations
    relationships: [
        { from: 'tasks.project_id', to: 'projects.id', type: 'many-to-one', onDelete: 'cascade' }
    ],

    // Migrations/seeding
    migrations: { tool: "", path: "", notes: "" },
    seed: { strategy: "idempotent scripts", path: "" },

    // Perf/scaling knobs
    performance: {
        poolMin: 0,
        poolMax: 10,
        timeoutMs: 10000,
        readReplicas: 0,
        partitioning: "",
        sharding: "",
        cachingLayer: "", // e.g., Redis
    },

    // Backups/retention
    backups: {
        enabled: true,
        schedule: "daily 02:00 UTC",
        retentionDays: 30,
        location: "",
        restoreTestCadence: "monthly",
    },
    dataRetention: [
        { table: 'events', retention: '30d', policy: '' }
    ],

    // Security/compliance
    security: {
        atRest: true,
        inTransit: true,
        rowLevelSecurity: false,
        accessModel: "RBAC",
        piiTables: ["users"],
    },

    // Handy queries + incidents log
    queriesOfInterest: [
        { name: 'List tasks by project', sql: 'SELECT ...', notes: '' }
    ],
    incidents: [
        { date: '2025-09-11', summary: 'Lock contention on tasks', actionItems: 'Add index on ...' }
    ],

    tags: ["oltp"],
};

export default databaseDefault;
