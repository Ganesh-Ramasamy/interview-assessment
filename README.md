# Waypoint Work Queue

A small React and TypeScript work-queue application used for a senior software engineer code-review exercise.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Use `npm run build` for a production build and `npm run lint` for ESLint.

## Candidate exercise

Review the proposed change against `main` as if it were a pull request. Focus your comments on correctness, user impact, and maintainability. Prioritize findings by severity, point each comment at the relevant code, and include a concrete scenario or rationale. Please do not spend the interview fixing the implementation.

The work queue supports searching, filtering by status, and marking items done or open. Sample data is in-memory and resets when the page reloads.