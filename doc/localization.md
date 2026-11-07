# Editor localization

The editor supports English, Vietnamese, Spanish, Russian, Ukrainian, Brazilian Portuguese, Simplified Chinese, Traditional Chinese, Indonesian, French, Arabic, and Persian.

The UI follows the browser language. An explicit `?lang=vi` (or another supported locale) overrides it. Regional variants resolve to the matching catalog; unsupported languages fall back to English. Arabic and Persian use right-to-left controls in the sidebar, comments, and selection panels. The slide canvas keeps its existing coordinate system and text direction.

English is the fallback catalog. Only the selected additional catalog is loaded, before editor components and module-level menu configuration are imported. This prevents an initial frame of mixed-language labels. Changing the locale requires a reload.

## Editing copy

- Wrap visible labels, tooltips, dialogs, messages, and menu items with `t()` from `@/i18n`. Templates also have the global `t()` helper.
- Add the same key to every `src/locales/*.json` catalog. Existing Chinese keys remain stable identifiers; new interpolated messages use complete sentences and `{p0}`, `{p1}`, etc.
- Keep placeholder names and counts identical. Translate a whole message rather than concatenating translated fragments.
- Keep comments distinct from speaker notes, slide numbers distinct from source-document pages, and animation start directions consistent with the animation ID.
- UI localization does not translate authored slides, imported documents, font family names, or backend protocol values.

## Validation

```sh
npm run check:i18n
node --test tools/i18n.test.mjs
npm run type-check
npm run build-only
```

The build checks catalog/key/placeholder parity, literal `t()` calls, and untranslated Chinese text in Vue template text and display attributes (including interpolated expressions). It does not judge translation meaning or inspect arbitrary script-generated copy; review those changes in context.

For visual checks, run the editor with `?lang=vi`, `?lang=es`, and `?lang=ar`, then inspect design settings, comments, selection, export, and animation controls. Also verify that the slide content stays unchanged.
