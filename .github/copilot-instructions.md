# Copilot / AI assistant instructions — pistaonline

This repo is a small static Single-Page Application (SPA) sample demonstrating an Auth0 authentication flow. The site is served as static files (Netlify configuration is present but no build step is required). Keep guidance concise and actionable and reference exact files below.

Key points for an AI editing this codebase
- Big picture: static SPA (no bundler). Entry point is `index.html` which loads `public/js/ui.js` and `public/js/app.js`. Static assets live under `public/` (CSS, images, JS). Auth configuration is in `auth_config.json`.
- Auth flow: `public/js/app.js` initializes an `auth0Client` via `auth0.createAuth0Client` using `auth_config.json`. Login currently uses `loginWithPopup()` (see `login()` in `public/js/app.js`). Redirect handling uses `auth0Client.handleRedirectCallback()` when URL contains `code` and `state`.
- Routing/UI: client routing is implemented in `public/js/ui.js` with a `router` object and history API (no hash routing). Links intended for client navigation have class `route-link`. Content panels have class `page` and are shown/hidden by `showContent(id)`.
- Visibility conventions: elements that should toggle based on auth state use the classes `auth-visible` and `auth-invisible`. Profile fields are populated by class selectors: `.user-name`, `.user-email`, `.profile-image`, and profile JSON is rendered into `#profile-data`.

Developer workflows (discoverable)
- Static site deployed with Netlify. `netlify.toml` shows `command = "# no build command"`. For local testing, use Netlify Dev (`netlify dev`) which provides the same environment as production. The app expects to be served over HTTP(S) from the project root so `auth_config.json` is reachable at `/auth_config.json`.
- Editing auth: change `public/js/app.js` to switch `loginWithPopup()` to `loginWithRedirect()` if you need redirect-based flows. The `requireAuth(fn, targetUrl)` helper centralizes protected-route behavior.

Patterns and examples to follow when generating code
- Global script pattern: JS files attach functions/vars to `window` (e.g., `login`, `logout`, `auth0Client`), not ES modules. Keep changes compatible with being loaded via `<script>` tags in `index.html`.
- Minimal DOM conventions: pages are `div.page` elements; toggling must keep other pages hidden. Use existing helpers `showContent`, `eachElement` in `public/js/ui.js` when adding UI behaviors.
- Auth-visible/hidden toggles: prefer reusing `eachElement('.auth-visible', ...)` or `.auth-invisible` instead of manipulating many selectors.

Integration points and files to inspect before edits
- `index.html` — entry point and script ordering (load order matters: ui.js then app.js). If you change global function names, update `index.html` accordingly.
- `public/js/app.js` — auth client initialization, login/logout, redirect handling, and `window.onload` boot logic.
- `public/js/ui.js` — router, `showContent`, `updateUI` (DOM population), and helper functions.
- `auth_config.json` — contains `domain` and `clientId` used by the SPA. Do not hard-code other credentials; prefer reading from this file.
- `netlify.toml` — documents that there is no build step and indicates Netlify functions folder (unused currently).

What NOT to change without explicit user instruction
- Do not convert scripts to ES modules or add a bundler/build system unless the user requests it. This repository intentionally serves plain JS via script tags.
- Do not alter `auth_config.json` credentials unless the user asks — these are real values for the sample environment.

Quick examples to reference in PRs
- To add an authenticated-only route `/settings` add an entry in `router` (in `public/js/ui.js`) similar to `/profile` that calls `requireAuth(() => showContent('content-settings'), '/settings')` and add a matching `<div id="content-settings" class="page hidden">` in `index.html`.
- To use redirect-based login replace `await auth0Client.loginWithPopup()` in `login()` (in `public/js/app.js`) with `await auth0Client.loginWithRedirect(options)` and ensure redirect handling remains (`handleRedirectCallback`).

If unclear or missing
- If an instruction requires access to a local dev server or Netlify CLI behavior that isn't present in the repo, ask the user whether they want me to add `package.json` + minimal dev server scripts or to rely on `python -m http.server`/`npx http-server`.

End of instructions — please review these points and tell me if you want more examples (code edits or PR-ready patches) or to expand to testing/build guidance.
