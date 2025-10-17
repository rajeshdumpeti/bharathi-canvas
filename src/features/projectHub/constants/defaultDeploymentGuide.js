// src/sections/deploymentGuide/constants/deploymentGuideDefault.ts

const deploymentGuideDefault = {
    overview: "",
    environments: [
        {
            name: "Development",
            url: "",
            infraType: "Docker Compose",
            branch: "develop",
            notes: "",
        },
        {
            name: "Staging",
            url: "",
            infraType: "Kubernetes",
            branch: "staging",
            notes: "",
        },
        {
            name: "Production",
            url: "",
            infraType: "EKS / Terraform",
            branch: "main",
            notes: "",
        },
    ],
    ciCd: {
        tool: "GitHub Actions",
        pipelineUrl: "",
        deployTriggers: ["PR merge", "manual"],
        rollbackStrategy: "Blue/Green or Canary",
    },
    scripts: [
        { name: "Start Backend", command: "npm run start:server" },
        { name: "Build Frontend", command: "npm run build:frontend" },
    ],
    monitoring: {
        tools: ["Grafana", "Dynatrace", "CloudWatch"],
        dashboards: [],
        alerts: [],
    },
    notes: "",
};

export default deploymentGuideDefault;
