// src/projectHub/sections/links/constants/linksDefault.ts

const linksDefault = {
  repositories: [
    {
      name: "Frontend App",
      url: "",
      branchStrategy: "trunk-based",
      owner: "",
      environment: "Prod",
      description: "Main React web application repository",
    },
    {
      name: "Backend API",
      url: "",
      branchStrategy: "gitflow",
      owner: "",
      environment: "Prod",
      description: "Primary FastAPI microservice repo",
    },
    {
      name: "Infrastructure (IaC)",
      url: "",
      branchStrategy: "trunk-based",
      owner: "",
      environment: "All",
      description: "Terraform/CDK repository for infra management",
    },
  ],

  documentation: [
    {
      type: "API Docs",
      url: "",
      owner: "",
      lastUpdated: "",
      description: "Swagger / Postman API documentation",
    },
    {
      type: "System Design",
      url: "",
      owner: "",
      lastUpdated: "",
      description: "Miro / Lucidchart architectural diagrams",
    },
    {
      type: "Tech Specs",
      url: "",
      owner: "",
      lastUpdated: "",
      description: "Technical requirements or Confluence design docs",
    },
  ],

  dashboards: [
    {
      tool: "Jenkins",
      url: "",
      environment: "Prod",
      description: "CI/CD build & deployment dashboard",
    },
    {
      tool: "Grafana",
      url: "",
      environment: "Prod",
      description: "Monitoring dashboard for service metrics",
    },
    {
      tool: "Datadog",
      url: "",
      environment: "Prod",
      description: "Error and performance monitoring",
    },
  ],

  cloud: [
    {
      provider: "AWS",
      resource: "Project Console",
      url: "",
      accessType: "Admin",
      environment: "Prod",
      description: "AWS Management Console link for this project",
    },
    {
      provider: "Kubernetes",
      resource: "Cluster Dashboard",
      url: "",
      accessType: "Read-only",
      environment: "Staging",
      description: "OpenShift / Lens / EKS cluster dashboard",
    },
  ],

  knowledgeBase: [
    {
      resource: "Onboarding Guide",
      url: "",
      owner: "",
      description: "Developer onboarding and environment setup guide",
    },
    {
      resource: "Jira Board",
      url: "",
      owner: "",
      description: "Agile sprint board for development tracking",
    },
    {
      resource: "Slack Channel",
      url: "",
      owner: "",
      description: "Team communication channel for quick support",
    },
  ],
};

export default linksDefault;
