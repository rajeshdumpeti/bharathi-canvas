export const DEFAULT_DATABASE = {
    overview:
        "This section defines all structured, unstructured, and AI-related data stores used across the system.",

    type: "Hybrid", // Relational + Vector + Cache
    primaryDB: {
        name: "MainAppDB",
        engine: "PostgreSQL",
        version: "15",
        purpose: "Transactional data store for core application",
        host: "",
        region: "us-east-1",

        replication: {
            enabled: true,
            mode: "Multi-AZ",
            replicas: 2,
        },
        scaling: {
            type: "Vertical",
            strategy: "Auto-scale read replicas",
            maxConnections: 500,
        },
        storage: {
            capacityGB: 200,
            autoScaling: true,
            storageType: "gp3",
        },
        backup: {
            frequency: "daily",
            retentionDays: 14,
            automated: true,
        },
        encryption: {
            atRest: true,
            inTransit: true,
            kmsKeyId: "",
        },
        monitoring: {
            metrics: ["CPUUtilization", "FreeStorageSpace", "Connections"],
            alertThresholds: {
                CPUUtilization: "80%",
                Connections: "90%",
            },
            tools: ["CloudWatch", "Datadog"],
        },
        maintenance: {
            window: "Sun:03:00-04:00 UTC",
            patching: "Automatic",
        },
    },

    secondaryDBs: [
        {
            name: "Redis Cache",
            type: "In-memory",
            engine: "Redis",
            version: "7.0",
            purpose: "Session storage and distributed caching layer",
            scaling: { strategy: "Cluster mode enabled", shards: 3 },
            persistence: "AOF",
        },
        {
            name: "Snowflake Warehouse",
            type: "Analytics",
            engine: "Snowflake",
            version: "latest",
            purpose: "Data analytics and BI reporting",
        },
    ],

    aiDatabases: [
        {
            name: "VectorStore",
            engine: "pgvector",
            version: "0.5.1",
            purpose: "Semantic search and embedding storage for AI features",
            integration: {
                framework: "LangChain",
                vectorSize: 1536,
                embeddingModel: "text-embedding-ada-002",
            },
            scaling: {
                strategy: "Partitioned by namespace",
                replicas: 1,
            },
            indexing: {
                indexType: "ivfflat",
                dimensions: 1536,
            },
        },
        {
            name: "ModelRegistry",
            engine: "MLflow",
            version: "2.9",
            purpose: "Track model versions, metadata, and experiment runs",
            storageBackend: "S3",
            accessPattern: "read/write via API and UI",
        },
        {
            name: "FeatureStore",
            engine: "Feast",
            version: "0.34",
            purpose: "Centralized repository of production ML features",
            storeType: "online/offline hybrid",
            onlineStore: "Redis",
            offlineStore: "BigQuery",
        },
    ],

    governance: {
        piiHandling: {
            maskedFields: ["ssn", "dob", "email"],
            retentionPolicy: "7 years",
        },
        auditLogging: {
            enabled: true,
            destination: "S3",
        },
        accessControl: {
            roles: ["DBA", "DataScientist", "AppService"],
            policies: ["Least privilege", "Row-level security"],
        },
    },

    performance: {
        indexingStrategy: ["BTREE", "GIN", "IVFFLAT"],
        cachingLayer: "Redis",
        queryOptimizer: "Enabled",
        vacuumPolicy: "Weekly",
    },

    disasterRecovery: {
        strategy: "Cross-region replication",
        rpo: "5 minutes",
        rto: "2 hours",
        failoverRegion: "us-west-2",
        lastDrill: "2025-09-15",
    },

    dataPipelines: [
        {
            name: "ETL - Application Logs",
            source: "App DB",
            destination: "Snowflake",
            frequency: "Hourly",
            transformation: ["PII Redaction", "Aggregation"],
        },
        {
            name: "Vector Updater",
            source: "Document Ingestion Service",
            destination: "pgvector",
            frequency: "Real-time",
            transformation: ["Text Embedding", "Chunking", "Normalization"],
        },
    ],
};

