# Plan: Migrate CI/CD from CircleCI to GitHub Actions

Tracks GitHub issue #2. Replaces CircleCI with GitHub Actions and moves
distribution of the `.c3addon` from Azure Blob Storage to **GitHub Releases**.

Branch: `BUR-0000-migrate-ci-github-actions` (base: `main`).

## Design decisions (locked)

| Decision | Choice |
|---|---|
| Distribution target | **GitHub Release asset** — drop Azure Blob, the Azure service principal, and 1Password entirely |
| Upload scope | **Tags only**; PR + main CI is secret-free |
| Auth | Built-in **`GITHUB_TOKEN`** with `contents: write` — no external secrets anywhere |
| Tag convention | **Keep digit-first** (`1.1.0.0`, `1.0.1.0`, …); GH glob `'[0-9]*.[0-9]*.*'` — equivalent of the old `/\d+\..*/` filter |
| Node | **22.14** (unchanged) |
| Release tool | `gh release create "$GITHUB_REF_NAME" Genvidtech_GCoreVideoPlugin.c3addon --generate-notes` (gh CLI is preinstalled on the runner; no third-party action) |

**Implication to flag in the PR:** consumers who previously pulled the addon from
the Azure `c3addons` container must switch to the GitHub Releases page.

## Workflows

### `.github/workflows/ci.yml` — fast feedback, no secrets
- Triggers: `pull_request` and push to `main`.
- Steps: `actions/checkout` → `actions/setup-node` (Node 22.14, npm cache) →
  `npm ci` → `npm run lint` → `npm run build` → `npm run zip:linux` →
  `actions/upload-artifact` uploading `Genvidtech_GCoreVideoPlugin.c3addon`
  (so reviewers can download a build per PR).
- No secrets, no `permissions` escalation.

### `.github/workflows/release.yml` — tag-triggered, publishes a Release
- Trigger: `push` of a tag matching `'[0-9]*.[0-9]*.*'`.
- `permissions: contents: write` (for creating the release / uploading assets).
- Steps: checkout → setup-node (22.14) → `npm ci` → `npm run lint` →
  `npm run build` → `npm run zip:linux` →
  `gh release create "$GITHUB_REF_NAME" Genvidtech_GCoreVideoPlugin.c3addon --generate-notes`
  with `env: GH_TOKEN: ${{ github.token }}`.

## Tasks (each one commit; validator gate before every commit)

- **Prep** — commit `plan.md`.
- **Task 1** — add `.github/workflows/ci.yml`. (`genvid-dev:ts-implementer`)
- **Task 2** — add `.github/workflows/release.yml`. (`genvid-dev:ts-implementer`)
- **Task 3** — remove `.circleci/config.yml`; add a brief "CI/CD on GitHub
  Actions / download the addon from Releases" note to the README/docs.
  (`genvid-dev:tech-writer`)
- Run `genvid-dev:code-reviewer` at the end.

## Verification

- Project gate `npm run lint && npm run build` passes locally before each commit.
- Workflow correctness verified by the PR's own `ci.yml` run going green.
- Release path verified after merge by pushing a test digit-version tag (or
  `workflow_dispatch`) and confirming the Release + attached `.c3addon`.

## Risks

- Workflow YAML isn't validated locally (no `actionlint` configured) — verified
  by the live PR run.
- Tag glob must match the existing 4-part tags — covered by `'[0-9]*.[0-9]*.*'`.
