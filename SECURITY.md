# Security

## Report a vulnerability

Email [Jorge Galarza](mailto:jgalarzah@gmail.com) with subject `jor-stack security`. Include the affected version or commit, impact, and minimal reproduction steps. Do not open a public issue for an unpatched vulnerability or include real credentials or private customer data.

Security fixes target the latest released version and the default branch. Older versions have no separate maintenance commitment. This is a community project with no guaranteed response time.

## Permissions and data

- Skills are instructions for your agent. The agent may read files, run commands, change code, or use configured integrations within the permissions you grant it. Review those permissions; prose is not a security boundary.
- The repository has no telemetry service or install hook. Agent providers and connected tools have their own data policies.
- Plugin installs configure `chrome-devtools-mcp@latest` through npx. It downloads and executes an external package, which can update independently. Standalone skill links do not configure that server. Review [upstream releases](https://github.com/ChromeDevTools/chrome-devtools-mcp/releases) and use a reviewed version in your own MCP configuration if you require a fixed dependency.
- The bundled flags disable MCP usage statistics and Google CrUX requests. They do not disable the agent provider's or browser's own data collection. See [upstream privacy documentation](https://github.com/ChromeDevTools/chrome-devtools-mcp#usage-statistics).
- Browser tools can inspect and modify page contents and read network traffic. Use an isolated browser context and test data; avoid sensitive personal sessions. Browser verification and development-server control require explicit requests in the skills.
- Local evidence belongs in Git-excluded `.scratch/`. Exclusion prevents normal commits, not access by tools or deliberate sharing. Review screenshots, logs, and handoffs before sharing them.
