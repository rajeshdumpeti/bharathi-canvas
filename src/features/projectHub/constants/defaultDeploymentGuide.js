// Default structure for a deployment guide across environments.
// Tweak engines/tools to match your stack.

const defaultDeploymentGuide = {
    overview:
        "How we build, ship, verify, and roll back the app across environments.",

    global: {
        repository: "",
        pipeline: "",                 // e.g. GitHub Actions workflow name
        artifactRegistry: "",         // e.g. GHCR / ECR / GCR
        runtimeNotes: "Node 20 / Python 3.11",
        onCallContact: "",            // name/email/slack
    },

    environments: [
        {
            key: "dev",
            label: "Development",
            domains: { app: "", api: "" },

            frontend: {
                buildCmd: "npm ci && npm run build",
                artifact: "",             // e.g. s3://bucket/app-dev-<sha>.zip
                container: { image: "", tag: "latest", registry: "" },
                deployCmd: "npx wrangler pages deploy ./dist",
                cdn: "Cloudflare",
                notes: "",
            },

            backend: {
                runtime: "FastAPI / Uvicorn",
                buildCmd: "poetry install && poetry build",
                container: { image: "", tag: "latest", registry: "" },
                migrationsCmd: "alembic upgrade head",
                deployCmd: "kubectl apply -f k8s/dev",
                notes: "",
            },

            database: {
                engine: "PostgreSQL",
                version: "",
                host: "",
                name: "",
                user: "",
                migrationTool: "Alembic",
                backupPolicy: "Daily (7 days)",
                readReplicas: false,
                notes: "",
            },

            envVars: [
                { key: "APP_URL", value: "", secret: false },
                { key: "API_URL", value: "", secret: false },
            ],

            preChecks: [
                "CI pipeline green",
                "No critical open incidents",
            ],
            postChecks: [
                "Basic smoke tests pass",
                "Error rate < 1% for 10 min",
            ],

            rollback: {
                strategy: "Re-deploy previous image tag",
                command: "",
                notes: "",
            },
        },

        {
            key: "staging",
            label: "Staging",
            domains: { app: "", api: "" },

            frontend: {
                buildCmd: "npm ci && npm run build",
                artifact: "",
                container: { image: "", tag: "", registry: "" },
                deployCmd: "aws s3 sync dist s3://my-site-staging",
                cdn: "CloudFront",
                notes: "",
            },

            backend: {
                runtime: "FastAPI / Uvicorn",
                buildCmd: "poetry install && poetry build",
                container: { image: "", tag: "", registry: "" },
                migrationsCmd: "alembic upgrade head",
                deployCmd: "kubectl apply -f k8s/staging",
                notes: "",
            },

            database: {
                engine: "PostgreSQL",
                version: "",
                host: "",
                name: "",
                user: "",
                migrationTool: "Alembic",
                backupPolicy: "Daily (14 days)",
                readReplicas: true,
                notes: "",
            },

            envVars: [
                { key: "APP_URL", value: "", secret: false },
                { key: "API_URL", value: "", secret: false },
            ],

            preChecks: [
                "Staging parity with prod (schema/flags)",
                "Change request approved",
            ],
            postChecks: [
                "QA smoke tests pass",
                "Synthetic checks green",
            ],

            rollback: {
                strategy: "Previous image tag / DB restore (if needed)",
                command: "",
                notes: "",
            },
        },

        {
            key: "prod",
            label: "Production",
            domains: { app: "", api: "" },

            frontend: {
                buildCmd: "npm ci && npm run build",
                artifact: "",
                container: { image: "", tag: "", registry: "" },
                deployCmd: "aws s3 sync dist s3://my-site-prod --delete",
                cdn: "CloudFront",
                notes: "Invalidate CDN after deploy.",
            },

            backend: {
                runtime: "FastAPI / Uvicorn (HA)",
                buildCmd: "poetry install && poetry build",
                container: { image: "", tag: "", registry: "" },
                migrationsCmd: "alembic upgrade head",
                deployCmd: "kubectl rollout restart deploy/api -n prod",
                notes: "Blue/green or canary preferred.",
            },

            database: {
                engine: "PostgreSQL (managed)",
                version: "",
                host: "",
                name: "",
                user: "",
                migrationTool: "Alembic",
                backupPolicy: "Point-in-time, 30 days",
                readReplicas: true,
                notes: "",
            },

            envVars: [
                { key: "APP_URL", value: "", secret: false },
                { key: "API_URL", value: "", secret: false },
            ],

            preChecks: [
                "Change freeze respected",
                "SLOs healthy",
                "On-call aware",
            ],
            postChecks: [
                "Business smoke tests pass",
                "No alert spikes",
                "CDN cache invalidation completed",
            ],

            rollback: {
                strategy: "Rollback to previous deployment revision",
                command: "kubectl rollout undo deploy/api -n prod",
                notes: "If schema changed, run down migration cautiously.",
            },
        },
    ],
};

export default defaultDeploymentGuide;
