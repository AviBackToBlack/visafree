# AGENTS.md

Repository-wide instructions for coding agents and automation.

## Project intent

`visafree` is a dependency-free static web application for visualising visa requirements. Preserve the simple static deployment model unless a change has a concrete reason to introduce tooling or a build step.

## Engineering constraints

- Do not introduce npm, a bundler, or a framework merely to perform routine maintenance.
- Keep the site deployable as plain HTML/CSS/JavaScript assets.
- Treat files under `js/` that are clearly third-party/minified libraries as vendored code; do not rewrite them as part of unrelated work.
- Prefer changes to the non-minified project source when both readable and minified variants exist, and keep generated/minified counterparts synchronized when required by the site.
- Preserve root-relative asset paths unless deployment behavior is intentionally changed.
- Do not commit credentials, API keys, tokens, or private data.

## Validation

Before merging changes, run the repository's static validation workflow. JavaScript changes must remain syntactically valid and HTML-local asset references must resolve to repository files.

## Governance

Do not weaken CI, security, repository governance, or release policy unless the task explicitly requires it and the change is documented.
