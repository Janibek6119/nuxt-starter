# This is a template

Feel free to delete everything in `./app` but keep:

- Imports in `assets/css/main.css`
- `app.vue`, obviously, with at least something of your preference

## More granular trim

### TS Scripts & tsx

Purpose: Putting .ts scripts plain into here dissatisfies TS very much.

Usage: `pnpm tsx scripts/example.ts`

Body:

- [scripts](./scripts) dir
- `tsx` package in [package.json](./package.json)

### i18n

Body:

- (optional) [vue-i18n.patch](./vue-i18n.patch) patch & [pnpm-workspace.yaml](./pnpm-workspace.yaml):`patchedDependencies`:`vue-i18n` entry - to enforce strict keys
- [i18n](./i18n) dir
- `i18n` section & `"@nuxtjs/i18n"` module & `"./i18n/const"` import @ [nuxt.config.ts](./nuxt.config.ts)
- Search for `$i18n`, `i18n` and `$t`