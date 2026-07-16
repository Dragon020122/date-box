# Date Box Working Rules

## Product
- Product name: 心动计划局 Date Box.
- This is a dreamy romantic dating-plan interaction game.
- Use gender-neutral language: TA、你们、对方.
- Never describe low compatibility as failure or incompatibility.

## Scope
- Do not add authentication, database, APIs, maps, payments, admin pages or heavy libraries.
- Do not expand the MVP without an explicit user request.
- Preserve the complete flow from welcome to memory card.

## Design
- Visual style: dreamy, romantic, creamy, pink-purple gradient, restrained glassmorphism.
- Avoid wedding style, cheap neon, excessive hearts, emoji-based design and dashboard templates.
- Mobile-first, with a designed desktop layout.
- The three portfolio-critical areas are:
  1. welcome and mood selection;
  2. compatibility result and mystery box;
  3. date plan and memory card.

## Engineering
- Use Next.js App Router, TypeScript, Tailwind CSS and Framer Motion.
- Avoid `any` unless unavoidable.
- Do not access `window` or `localStorage` at module scope.
- Keep interactive components as client components and keep boundaries focused.
- Prefer reusable components over one giant page component.
- A component should preferably remain below 300 lines.
- Read the relevant local Next.js guide in `node_modules/next/dist/docs/` before using framework APIs.
- Run `npm run build` after every development stage.
- Update `docs/STATUS.md` after every stage.
- Fix errors before continuing to the next stage.

## Verification
- Check mobile at 390x844 and desktop at 1440x900 when browser tools are available.
- Check horizontal overflow, layout shifts, console errors, interaction feedback and keyboard focus.
- Do not claim visual verification if a browser was not actually used.
