# Publication checklist

Cursor requires open-source plugins, a public Git repository, valid packaging, and local testing. Listings and updates are reviewed by Cursor. A plugin does not need to be copied into `cursor/plugins` to apply. Sources: [plugin guide](https://cursor.com/docs/plugins), [submission reference](https://cursor.com/docs/reference/plugins), and [marketplace security](https://cursor.com/help/security-and-privacy/marketplace-security), checked 2026-10-29.

## Before making the repository public

- Confirm the right to publish original contributions and retain `LICENSE`, `THIRD_PARTY_NOTICES.md`, and `UPSTREAM.md`. MIT requires preserving its copyright and permission notice. Community guidelines and CI help maintain the project; they do not replace license compliance.
- Review all branches, tags, reachable history, commit identities, issues, and attachments for secrets, private company information, or content you cannot redistribute. A clean current checkout is insufficient. Rotate any exposed credential before removing it from history.
- Decide whether to publish the existing history or a clean export. Changing visibility exposes historical files even after deletion. Do not rewrite shared history without agreement.
- Review staged files; exclude private local rules, credentials, screenshots, and scratch output. Export only the intended committed files.

## Release checks

```sh
ruby scripts/validate-stack.rb
ruby scripts/validate-stack.test.rb
node --test skills/jor-verify/scripts/run-checks.test.mjs
git diff --check
```

Validate `.cursor-plugin/plugin.json` and `.cursor-plugin/marketplace.json` against Cursor's [plugin schema](https://raw.githubusercontent.com/cursor/plugins/main/schemas/plugin.schema.json) and [marketplace schema](https://raw.githubusercontent.com/cursor/plugins/main/schemas/marketplace.schema.json). Validate the portable `plugin.json` and `mcp.json` against their declared schemas. The local validator covers project invariants, not the full remote schemas.

Keep versions in `plugin.json`, `.cursor-plugin/plugin.json`, and `.cursor-plugin/marketplace.json` aligned. Version 0.2.0 is recorded in the changelog; tagging and publication follow the checks below. Keep the single-entry marketplace for team imports. A logo is optional; if one is added, use an owned or licensed asset and a relative path in the Cursor manifest.

## Test the actual package

Follow the README's [local installation steps](../README.md#cursor) using a committed export. Record the commit, Cursor version, operating system, and results:

- Confirm all 23 skills and the Chrome DevTools MCP configuration appear in Customize. Verify no personal rules are included.
- Invoke `/jor-mode` and `/jor-get-ready` on a harmless sample project; confirm skill references resolve and investigation does not edit files.
- Test one authorized implementation and its peer-review or self-review path. Manual skills should not run without the user's request.
- With an explicit browser-check request, confirm the MCP server starts with the bundled privacy flags and completes a harmless check in an isolated context. Confirm no development server is started without a request.
- For Codex support, confirm plugin discovery and one explicit skill invocation in Codex too.

Static validation cannot complete these checks. Do not mark unexecuted checks as passing.

## Publish and submit

1. Obtain maintainer approval for the reviewed release and history choice. Commit and push the release, then make the chosen repository public. Verify anonymous access to the files.
2. Set the repository description to the plugin description, and choose relevant topics such as `cursor-plugin`, `agent-skills`, `frontend`, and `workflow`. Enable GitHub security reporting and secret protection where available; confirm CI passes on the published commit.
3. Create the release tag and release notes for that commit.
4. Sign in at [Cursor Marketplace submission](https://cursor.com/marketplace/publish) and submit the repository URL. Resolve any name conflict or reviewer feedback. Submission does not guarantee listing.
5. Add marketplace installation instructions only after the listing works. Keep source installation instructions available.

Submission values:

| Field | Value |
| --- | --- |
| Repository / homepage | `https://github.com/jorsisu/jor-stack` |
| Plugin / display name | `jor-stack` |
| Version | `0.2.0` |
| Author | Jorge Galarza |
| License | MIT |
| Category | Developer Tools |
| Description | Front-end workflow skills for planning, implementation, review, and verification in Cursor and Codex |

Change repository links throughout the package if publication uses a different repository.
