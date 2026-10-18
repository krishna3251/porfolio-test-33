<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This repository uses a newer Next.js version with breaking changes. Before changing routes, layouts, metadata, caching, server actions, middleware/proxy behavior, or other framework APIs, read the relevant guide in `node_modules/next/dist/docs/` for the installed version. Follow current deprecation notices rather than relying on older examples.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Portfolio Test (Next.js)

## Stack and project conventions
- The repository currently uses Next.js 16.2.x and React 19.2.x. Verify installed versions from `package.json` and the lockfile before relying on version-specific behavior.
- This is an App Router project. Inspect the relevant route, layout, component, and shared utility before editing.
- Preserve existing page structure, visual identity, animations, and component conventions. Avoid broad rewrites for local fixes.

## Implementation rules
- Respect server/client component boundaries. Add `"use client"` only when client-side state, effects, event handlers, or browser APIs require it.
- Keep secrets and privileged operations on the server. Validate inputs and authorize sensitive mutations at the server boundary.
- Preserve semantic HTML, keyboard accessibility, responsive layouts, reduced-motion behavior, and loading/error states.
- Avoid new dependencies unless they solve a real requirement. Keep animation libraries and effects purposeful and performant.
- Do not duplicate components or styles when an existing abstraction fits.

## Verification
- Check available scripts in `package.json`. Current scripts include `npm run lint` and `npm run build`.
- Use the installed Next.js documentation for this version and run relevant lint/build checks when practical.
- Do not claim browser behavior was verified unless it was actually run. Review the final diff for accidental generated files, secret leakage, and unrelated edits.