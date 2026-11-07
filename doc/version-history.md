# Version history

The editor saves a complete presentation every minute when it has changed, when the page becomes hidden, before bulk slide/theme/size changes, and on request from the version history drawer. A browser reload opens the latest saved version. Changes since the last successful save can be lost if the browser terminates before the next save.

The standalone editor has one persistent local workspace. Importing or resetting replaces that workspace, retaining its previous versions. History is local to the browser and origin; clearing site data removes it. The separate `pptist-version-history` database survives transient undo-database cleanup.

The default adapter retains 30 versions per document within a 50 MiB total serialized-data budget across documents. Old entries are removed in the same IndexedDB transaction that inserts a new one. An oversized version or a quota failure leaves existing history intact. The byte budget measures serialized content, not browser storage overhead. Errors appear in the header and drawer; an unreadable history prevents writes until a successful retry.

## Host storage

After installing Pinia and before mounting the app, configure `useVersionsStore().configure(documentId, adapter)`. `documentId` must be the host's stable document identifier. Configure once per mounted editor instance. The standalone default is `local-workspace`.

The `VersionStorage` interface in `src/types/version.ts` has two methods:

- `list(documentId)` returns full versions, newest first, or rejects on a read failure.
- `save(version)` persists the complete version atomically, applies retention, and rejects on failure. Version IDs are unique and should be used for idempotent writes.

A remote adapter owns authentication, document isolation and retention. No backend is required by the default adapter or panel.

A restore first saves the current presentation, records it in undo history, applies the selected version, and saves a new version. Undo and redo include slides, title, theme and slide dimensions. Preview uses the saved dimensions and theme without changing the active presentation.
