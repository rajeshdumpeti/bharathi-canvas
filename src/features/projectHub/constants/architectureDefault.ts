// src/features/projectHub/constants/architectureDefault.js
const architectureDefault = {
    overview: "",

    diagrams: [
        { label: 'System Context', url: '' }
    ],

    services: [
        { name: 'web', language: 'TypeScript', runtime: 'Node 20', repoUrl: '', owner: 'App Team' }
    ],

    apis: [
        { name: 'Tasks', method: 'GET', path: '/api/tasks', auth: 'JWT', service: 'web', description: '' }
    ],

    dataStores: [
        { name: 'app-db', type: 'PostgreSQL', version: '15', purpose: 'Primary OLTP' }
    ],

    queues: [
        { name: 'events', tech: 'Kafka', purpose: 'Domain events' }
    ],

    thirdParty: [
        { name: 'Stripe', purpose: 'Payments', docsUrl: '' }
    ],

    observability: {
        logs: "CloudWatch",
        metrics: "Prometheus",
        tracing: "OpenTelemetry",
        dashboardsUrl: "",
        alertsUrl: "",
    },

    security: {
        encryptionAtRest: true,
        encryptionInTransit: true,
        threatModelUrl: "",
        dataRetentionNotes: "",
        corsPolicy: "",
        cspNotes: "",
    },

    availability: {
        sla: "99.9%",
        slo: "99.9%",
        rpo: "15m",
        rto: "30m",
    },

    scaling: {
        strategy: "Horizontal",
        autoScaling: true,
        notes: "",
    },

    decisions: [
        { date: '2025-09-10', title: 'Pick Postgres', status: 'Accepted', link: '' }
    ],

    risks: [
        { risk: 'Vendor lock-in', mitigation: 'Abstract provider' }
    ],

    tags: ["microservice", "rest"],
};

export default architectureDefault;
