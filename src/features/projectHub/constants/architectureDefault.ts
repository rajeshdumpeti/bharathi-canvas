// src/features/projectHub/constants/architectureDefault.ts

const architectureDefault = {
  overview:
    "This document outlines the end-to-end system architecture, including microservices, data stores, APIs, infrastructure, and observability strategy.",

  diagrams: [
    { label: "System Overview Diagram", url: "" },
    { label: "Deployment Architecture", url: "" },
  ],

  // Core Architecture Components
  services: [
    {
      name: "User Service",
      language: "Python",
      runtime: "FastAPI 0.110",
      repoUrl: "https://github.com/org/user-service",
      owner: "platform-team",
      description: "Handles authentication, user profiles, and permissions.",
    },
  ],

  apis: [
    {
      name: "Get User Profile",
      method: "GET",
      path: "/api/v1/users/{id}",
      auth: "OAuth2",
      service: "User Service",
      description: "Fetch user details by ID from the profile database.",
    },
  ],

  dataStores: [
    {
      name: "UserDB",
      type: "PostgreSQL",
      version: "15",
      purpose: "Stores user metadata and authentication credentials.",
    },
    {
      name: "Redis Cache",
      type: "Redis",
      version: "7",
      purpose: "Session caching and rate-limiting storage.",
    },
  ],

  queues: [
    {
      name: "user-events-queue",
      tech: "AWS SQS",
      purpose: "Async processing of user events.",
    },
  ],

  thirdParty: [
    {
      name: "Stripe",
      purpose: "Payments and invoicing integration",
      docsUrl: "https://stripe.com/docs/api",
    },
  ],

  integrations: [
    {
      name: "Salesforce CRM",
      type: "External",
      protocol: "REST",
      auth: "OAuth2",
      purpose: "Sync customer leads and case data.",
    },
  ],

  infrastructure: {
    cloudProvider: "AWS",
    region: "us-east-1",
    compute: "ECS Fargate",
    storage: ["S3 (document storage)", "EFS (shared configs)"],
    networking: ["VPC with 3 subnets (public, private, DB)"],
    infraAsCode: "Terraform",
  },

  dataFlow: {
    source: "API Gateway → Kafka → ETL → Snowflake",
    destination: "PowerBI Dashboard",
    transformations: [
      "JSON flattening",
      "PII masking",
      "time window aggregation",
    ],
    frequency: "Hourly",
  },

  observability: {
    logs: "CloudWatch (structured JSON logging via FluentBit)",
    metrics: "Prometheus + Grafana",
    tracing: "AWS X-Ray",
    dashboardsUrl: "https://grafana.company.io/dashboards",
    alertsUrl: "https://pagerduty.company.io",
  },

  monitoring: {
    tool: "Datadog",
    alertThresholds: {
      CPU: "85%",
      Memory: "80%",
      ErrorRate: "2%",
    },
    alertChannels: ["#ops-alerts", "oncall@company.io"],
  },

  security: {
    encryptionAtRest: true,
    encryptionInTransit: true,
    threatModelUrl: "https://confluence.company.io/threat-model",
    dataRetentionNotes: "PII encrypted using AES256; logs retained 90 days.",
    corsPolicy: "Restrict origins to internal and trusted partners.",
    cspNotes: "CSP enforced via CloudFront headers.",
  },

  compliance: {
    standards: ["SOC2", "GDPR", "HIPAA"],
    dataClassification: "Confidential",
    retentionPeriod: "7 years",
  },

  availability: {
    sla: "99.9%",
    slo: "99.5%",
    rpo: "30 minutes",
    rto: "1 hour",
  },

  scaling: {
    strategy: "Horizontal",
    autoScaling: true,
    notes: "Scale ECS tasks based on CPU and request queue depth.",
  },

  performance: {
    expectedUsers: "500k monthly active users",
    peakRPS: "2000",
    responseTimeTarget: "p95 < 300ms",
    scalingStrategy: "Auto-scale microservices and cache aggressively",
    bottlenecks: ["Database I/O under peak load", "Cache invalidation latency"],
  },

  deployment: {
    workflow:
      "GitHub → PR → GitHub Actions → Docker → ECR → ECS → Slack Notify",
    environments: ["dev", "test", "staging", "prod"],
    rollbackStrategy: "Blue/Green deployment with ECS task rollback.",
  },

  disasterRecovery: {
    backupFrequency: "Daily full backup + hourly WAL archive",
    restoreTime: "Under 2 hours",
    replication: "Cross-region S3 replication",
    lastTested: "2025-09-01",
  },

  decisions: [
    {
      date: "2025-10-01",
      title: "Move from EC2 to ECS Fargate",
      status: "Approved",
      reason: "Simplified scaling and reduced ops overhead",
      impact: "Faster deployments, fewer infra tickets",
      link: "https://confluence.company.io/adr-ecs-migration",
    },
  ],

  risks: [
    {
      risk: "Single-region deployment may cause downtime during AWS outages",
      mitigation: "Enable multi-region failover using Route 53 health checks",
    },
  ],

  tags: ["backend", "microservices", "AWS", "observability", "security"],
};

export default architectureDefault;
