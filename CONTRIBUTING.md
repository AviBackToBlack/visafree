# Contributing

Thanks for contributing to `visafree`.

## Development model

This repository intentionally uses a simple static HTML/CSS/JavaScript layout with no package manager or build system. Please do not introduce a new dependency/toolchain for a small change unless the pull request explains why it is necessary.

## Pull requests

- Keep changes focused.
- Preserve the static deployment model unless the change intentionally redesigns it.
- Do not edit vendored/minified third-party libraries as part of unrelated work.
- Update both readable and minified project assets when the site expects both variants.
- Run the GitHub static-validation checks before merge.
- Do not commit secrets or private data.

## Security issues

Do not report suspected vulnerabilities in a public issue. Follow `SECURITY.md` and use GitHub private vulnerability reporting when it is available.
