# Continuous i18n sync

This fork keeps Chinese (`zh`) as the source of truth and maintains English (`en`) and French (`fr`) translations via [`@ai-localizer/cli`](https://www.npmjs.com/package/@ai-localizer/cli).

## One-time setup

Already done in this fork:
- `package.json#aiI18n` declares source locale `zh` + targets `en`, `fr`.
- `src/locales/{zh,en,fr}.json` hold the key trees.
- `src/i18n/index.ts` wires `vue-i18n` with all three locales.
- `src/components/LanguageSwitcher.vue` provides a minimal selector.
- `.gitignore` excludes `.i18n-cache/` + `.i18n-queue/`.

## Convenience scripts (package.json)

```bash
npm run i18n:extract   # scan source → update zh.json
npm run i18n:sync      # propagate keys to en.json / fr.json
npm run i18n:cleanup   # drop keys no longer referenced in source
npm run i18n:status    # coverage report
npm run i18n:plan      # emit .i18n-queue/<locale>.pending.json for missing strings
npm run i18n:apply     # merge .i18n-queue/<locale>.answers.json into locales
```

## Sync from upstream

Whenever upstream `pipipi-pikachu/PPTist` adds new Chinese strings:

```bash
# 1. pull upstream changes into local master
git fetch upstream
git checkout master
git merge upstream/master

# 2. re-run the deterministic pipeline (zero AI tokens)
npm run i18n:extract     # pick up new source strings
npm run i18n:sync        # propagate to en/fr (new keys appear untranslated)
npm run i18n:cleanup     # drop deleted keys

# 3. emit the translation batch
npm run i18n:plan
# -> .i18n-queue/en.pending.json
# -> .i18n-queue/fr.pending.json

# 4. translate: either
#    (a) let Claude/Codex handle it via the localizer skill, or
#    (b) paste pending JSON into your translator, write answers.json manually
#
# For Claude (with skills/localizer installed):
#   "run localizer to translate pending i18n for PPTist"

# 5. merge answers back + verify
npm run i18n:apply
npm run i18n:status
npm run build
```

Commit the updated `src/locales/*.json` + any replaced source files. Push to your fork, open a PR against upstream if you want to contribute back.

## GitHub Action (optional)

See [`.github/workflows/i18n-sync.yml`](../.github/workflows/i18n-sync.yml). Triggers on pushes to `master` that touch `src/**`. It re-runs `extract`, `sync`, and `cleanup`, then commits any drift back (no translation — just structural upkeep). Human/AI still needs to run the `plan → answers → apply` loop for fresh strings.

## Persistent cache

`.i18n-cache/cache.json` (gitignored) dedupes `source → target` pairs across runs. A Chinese string that already has a French translation in cache never hits the pending JSON again, even if it reappears after a refactor. Safe to delete if you want to re-translate from scratch.

## Troubleshooting

- **`"t" is not exported by "src/i18n/index.ts"`** on build: `src/i18n/index.ts` must export `t` alongside `i18n` (see current file — uses `i18n.global.t`).
- **Build succeeds but UI still shows Chinese after switching**: some literals in `.vue`/`.ts` files were not auto-replaced (replace phase is conservative). Re-run `npm run i18n:extract && npm run i18n:sync` and inspect the diff; use the VS Code extension or replace phase on the specific file.
- **`translate plan` reports 0 pairs but UI has untranslated strings**: cache may have stale entries. Delete `.i18n-cache/cache.json` and re-plan.
