# GitHub-backed content workflow

Verified: 2026-08-09
Repository: `IsaacMorzy/Eeens`

## Decision

Keep content in the repository under `src/content/` and let TinaCMS map those files to GitHub branches. Astro should build the checked-out repository contents. Do not add a runtime fetch from raw GitHub URLs.

This is already the repository's architecture:

- 16 content files are tracked by Git under `src/content/`.
- Tina collections map to `src/content/page`, `src/content/blog`, `src/content/property`, and `src/content/config`.
- `tina/config.ts` resolves the active branch from `GITHUB_BRANCH`, `VERCEL_GIT_COMMIT_REF`, `HEAD`, then `main`.
- `package.json` runs `tinacms build --content=local` before `astro build`. Here, `local` means the checked-out repository filesystem used by the build; it does not mean untracked or non-GitHub content.
- Tina Cloud can use the configured branch and editorial workflow to write content changes to GitHub, including review branches and draft pull requests where enabled.

## Why not fetch raw GitHub content from Astro?

Direct raw-GitHub fetching would add a second content transport and introduce token handling, rate limits, remote availability failures, cache ambiguity, and a bypass around Tina's generated schema/client. It would also make local, preview, and production content behavior diverge. The checked-out GitHub commit is the deterministic build input; Tina is the editor/branch bridge.

## Read-only state workflow

Run these before a content or GitHub operation:

```bash
git status --short --branch
git branch -vv
git ls-remote origin refs/heads/main
gh auth status
gh repo view --json nameWithOwner,defaultBranchRef,isPrivate,url
gh pr list --limit 20
gh issue list --limit 20
git ls-files 'src/content/**'
```

Redact credentials and tokens. Compare the live remote SHA with the local `HEAD`, then separately account for uncommitted working-tree content. A clean `0 ahead / 0 behind` comparison does not mean dirty local changes are on GitHub.

## Human gates

- Read-only state checks are safe by default.
- `fetch`, `pull`, commit, branch publication, PR creation, merge, issue closure, and content deployment are separate operations. Tell the human what will happen first.
- `loop-constraints.md` requires no push before notification, a draft PR before marking work ready, and human approval before merge or issue closure.
- Never include Tina tokens or generated client files containing tokens in reports or commits.

## Sources

- TinaCMS Astro framework guide: https://tina.io/docs/frameworks/astro
- TinaCMS local development: https://tina.io/docs/tinacloud/local-development
- TinaCMS editorial workflow: https://tina.io/docs/tinacloud/editorial-workflow
- Astro TinaCMS guide: https://docs.astro.build/en/guides/cms/tina-cms/
- Repository remote: https://github.com/IsaacMorzy/Eeens
