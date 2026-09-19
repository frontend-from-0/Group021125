# Lesson 41 — NodeJs Introduction (Instructor Notes)

**Topic:** Node.js introduction (runtime, core modules, Express hello-world path)  
**Cohort:** Group021125 (Web Developer)  
**When:** Wed 24 Sep 2026, 19:30 Europe/Istanbul  
**Historical source:** `frontend-from-0/Group130625` Lesson41  
- Starter: `1fdaa80` “Lesson 41 starter files” (`nodejs.md` only)  
- Completed: `0b3491d` “Lesson41 completed files” (demos + same `nodejs.md`)

## Teaching sequence

1. **What is Node.js** — open-source, cross-platform JS runtime; V8 outside the browser (`nodejs.md` Definition).
2. **Architecture & asynchronicity** — single process, non-blocking I/O, event loop; why this matters for servers.
3. **Full-stack context** — same language on client and server; you control the ECMAScript version via Node version.
4. **Core modules walkthrough** (from `nodejs.md`):
   - **http** — low-level server; foundation for Express
   - **fs** / **fs/promises** — prefer async
   - **path** — cross-platform path joins
   - **os** — system info demos
   - **events** / EventEmitter — `.on` / `.emit`
   - **streams** — chunked I/O, memory efficiency
5. **Live demos (this PR’s completed folders)**
   - `nodejs-plain-example/script.js` — plain Node script
   - `nodejs-express-hello-world/` — minimal Express app (`index.js`)
   - `express-demo/` — fuller Express+TS starter (routes, middleware, users resource) for “what a real layout looks like”
6. **Useful links** (also in `nodejs.md`): Node synopsis, Express installing guide, Express TS template.

## Starter vs completed

- **Student starter PR:** only `Lesson41/nodejs.md` (theory handout).
- **This instructor PR:** completed demos (`express-demo`, `nodejs-express-hello-world`, `nodejs-plain-example`) + `nodejs.md` (unchanged between historical commits) + these notes.

## Classroom tips

- Start students on plain `http` or the hello-world Express before showing the TS `express-demo`.
- Stress async `fs` vs sync; do a short blocking vs non-blocking contrast if time allows.
- Do not merge instructor demos into student main before class unless that is your usual pattern.
