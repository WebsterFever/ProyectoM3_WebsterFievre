# Chat with Your Favorite Character — Integrative Project 3

A Single Page Application that lets users chat with fictional characters using
Google Gemini AI. The backend uses a Vercel Serverless Function as a proxy,
so the API key is never exposed in the browser.

## Available Characters

| Character | Personality |
|---|---|
| 🧙‍♂️ Yoda (Star Wars) | Wise, enigmatic, speaks by inverting the usual word order |
| 🦾 Tony Stark (Iron Man) | Sarcastic, witty, and confident |
| 📚 Hermione Granger (Harry Potter) | Intelligent, studious, and often cites books and spells |

Each character has its own system prompt in `src/characters.js`.

## Features

- **SPA routing with the History API**: navigation between `/home`, `/chat`, and `/about`
  without reloading the page, with full browser back/forward support
  (`popstate`).
- **AI chat**: visually differentiated messages, a typing indicator,
  sending with a button or `Enter`, and network error handling.
- **Mobile-first responsive design** with breakpoints at `600px` (tablet) and
  `1024px` (desktop).
- **Persistence with localStorage**: history is stored per character,
  restored after reload, and can be cleared with the "Clear history" button.
  The Home gallery shows which characters have saved history.
- **Character gallery**: choose who to chat with from visual cards
  on the Home page.
- **UX extras**: timestamps on every message, a button to copy AI responses
  to the clipboard, and a dark/light mode toggle.

## Screenshots

| Home (desktop) | Chat (desktop) | About (desktop) |
|---|---|---|
| ![Home desktop](src/asset/image1.png) | ![Chat desktop](src/asset/image2.png) | ![About desktop](src/asset/image3.png) |

| Home (tablet) | Home (mobile, menu closed) | Home (mobile, menu open) |
|---|---|---|
| ![Home tablet](src/asset/image4.png) | ![Home mobile](src/asset/image5.png) | ![Burger menu open](src/asset/image6.png) |

## Chat Architecture: Generic Payload + Adapter

The frontend never builds a Gemini-specific request. Instead, it creates a
**generic payload** (`model`, `system`, `messages`, `max_tokens`,
`temperature`) and sends it directly to `/api/chat`. The backend is the only
part that knows the provider is Gemini and translates that contract into Gemini's format. If
the AI provider changes in the future, only `api/chat.js` and
`api/utils/gemini.js` need to change — the rest of the app remains untouched.

```
Frontend (src/engine/)                    Backend (api/)
─────────────────────                     ──────────────
payload.js   → builds { model, system,      chat.js       → orquesta todo
                messages, max_tokens,     utils/request.js  → reads and validates
                temperature }                                the payload
history.js   → trims history       utils/gemini.js   → adapts the
                before sending it                             payload to Gemini
aiClient.js  → POST to /api/chat           utils/response.js → returns
normalizer.js → parses the response                          the same
                a { text, truncated }                        shape (content[])
                                          utils/errors.js    → detects rate
                                                                limit (429)
```

## Project Structure

```
PoyectoEntregrador3/
├── api/
│   ├── chat.js                  # Serverless function: orchestrates the pipeline
│   └── utils/
│       ├── request.js            # parseJsonBody, getMessages, getGenerationSettings
│       ├── gemini.js              # Adapta the payload generico al formato de Gemini
│       ├── response.js             # Uniform response shape (content[])
│       └── errors.js                # getHttpStatus, isRateLimitError
├── src/
│   ├── main.js             # Entry point
│   ├── router.js            # SPA routing with the History API
│   ├── navigation.js        # Navigation rendering + theme toggle
│   ├── state.js              # Selected character (in-memory state)
│   ├── characters.js         # Character definitions, system prompts, and temperature
│   ├── storage.js             # localStorage helpers (history, theme)
│   ├── theme.js                # Dark/light mode
│   ├── utils.js                  # Pure functions (HTML escaping, messages, etc.)
│   ├── engine/
│   │   ├── payload.js               # buildPayload, isValidPayload, createSystemPrompt
│   │   ├── history.js                # getTrimmedHistory (context trimming)
│   │   ├── aiClient.js                 # callAI(payload) -> fetch a /api/chat
│   │   └── normalizer.js                # normalizeAIResponse, extractUsage
│   └── views/
│       ├── home.js         # Character gallery + welcome section
│       ├── chat.js          # Chat interface
│       ├── about.js          # Project information
│       └── notFound.js        # 404 view
├── tests/                # Unit tests (Vitest)
├── index.html
├── styles.css
├── vercel.json           # SPA rewrites (same pattern as M3L7)
├── vitest.config.js
├── package.json
├── .env.example
└── .env                  # Not committed to the repo (see .gitignore)
```

## Prerequisites

- Node.js 18 o superior
- A [Google AI Studio](https://aistudio.google.com/) API key for Gemini
  (a free tier is available and no credit card is required to get started)

## Installation

```bash
npm install
```

Copy `.env.example` to `.env` (or fill in the existing `.env`) and add your
API key:

```
GEMINI_API_KEY=your_google_ai_studio_api_key
GEMINI_MODEL=gemini-2.5-flash
```

## Run Locally

Do not open `index.html` by double-clicking it: History API routing requires
the app to be served over HTTP (not `file://`).

```bash
npm run local
```

This runs `vercel dev` (through `npx`, without requiring a global CLI install
or login for local development). It serves the static site and the
`api/chat.js` serverless function together, respecting the rewrites in
`vercel.json` so `/chat` and `/about` still work when the page is reloaded
directly on those routes — the same flow used in the M3L7 reference solution.

> The script is intentionally named `local` instead of `dev`: if it is named `dev`,
> Vercel CLI detects it as the project's "Development Command" and
> `vercel dev` ends up calling itself in an infinite loop.

Open `http://localhost:3000` and test navigation between views, browser
back/forward buttons, the character gallery, dark/light mode, localStorage
persistence, and real chat with each character.

## Tests

The project includes 60 unit tests with [Vitest](https://vitest.dev/)
covering the pure functions in the chat pipeline: payload construction and validation,
adaptation to Gemini's format, response normalization, history trimming,
character handling, routing, localStorage persistence, and the network client
with mocked `fetch` calls (without using the real network).

```bash
npm test
```

Test files:

- `tests/payload.test.js` — `buildPayload` builds the correct contract;
  `isValidPayload` detects malformed payloads (including the case of a
  `role: "system"` inserted inside `messages[]`).
- `tests/history.test.js` — `getTrimmedHistory` trims history to the turn limit.
- `tests/normalizer.test.js` — `normalizeAIResponse` safely extracts text
  and never breaks on unexpected shapes; `extractUsage` reads token usage.
- `tests/aiClient.test.js` — `callAI` with **mocked** `fetch` (`vi.stubGlobal`),
  without real network access: verifies the POST request, success cases, HTTP errors, rate limiting (429), and
  non-JSON responses.
- `tests/api-gemini.test.js` — the adapter maps `assistant` → `model` y
  filtra roles inválidos before sending its a Gemini.
- `tests/api-request.test.js` — body parsing, `messages[]` validation,
  and `getGenerationSettings` defaults.
- `tests/api-response.test.js` — the response shape (`content[]`,
  `stop_reason`, `usage`) is consistent regardless of the provider.
- `tests/api-errors.test.js` — rate-limit (429) and HTTP status detection.
- `tests/utils.test.js` — HTML escaping, message creation, timestamps,
  and conversion of internal messages to the `{role, content}`.
- `tests/characters.test.js` — character lookup by id and validation that each one has `systemPrompt` y `temperature` valid values.
- `tests/router.test.js` — route resolution to the corresponding views.
- `tests/storage.test.js` — saving, reading, and clearing history in localStorage.

## Deploy on Vercel

The application is deployed at:
**https://proyecto-m3-webster-fievre.vercel.app/**

The `vercel.json` file with the rewrites is already in the repository, so the deployment flow was:
push the repository to GitHub, import it into [Vercel](https://vercel.com/new),
configure the `GEMINI_API_KEY` and `GEMINI_MODEL` environment variables under
**Settings → Environment Variables**, and deploy. Vercel automatically detects
`api/chat.js` as a Serverless Function.

## Security Notes

- The Gemini API key is used only inside `api/chat.js`, which runs on the
  Vercel server. The client never sees it.
- User text is escaped (`escapeHTML`) before being inserted into the DOM
  to prevent HTML injection.
- If an API key is accidentally exposed (for example, pasted into a chat,
  commit, or log), it should be rotated/revoked in the provider's dashboard
  and replaced with a new one.

## About the Use of AI During Development

This project was built with assistance from Claude (Anthropic) as a
development copilot. Summary of the process:

- The AI was asked to generate the base SPA structure (Part 0 and
  Part 1 of the guide) with simple routing before integrating an AI provider.
- The AI provider was first tested with Gemini, temporarily migrated to
  OpenAI (because of API key availability), and later changed back to Gemini
  to align with what was taught in the course's `M3L7`. The
  `M3L7/resolution` architecture was used as a reference (generic payload in the frontend +
  provider-specific adapter in the backend), reproduced in
  `src/engine/` and `api/utils/`. Thanks to that separation, each provider change
  only required changes to `api/chat.js` and the adapter file
  (`api/utils/gemini.js`), without modifying the rest of the app.
- Decisions based on AI suggestions included choosing Yoda, Tony Stark, and
  Hermione Granger because they have very distinctive voices that are easy to capture
  in a short system prompt. Pure functions (`utils.js`, `characters.js`, `engine/`, `api/utils/`)
  were separated from code with side effects (DOM, localStorage, fetch, API calls)
  specifically to make Vitest testing possible with very little mocking.
- All generated code was reviewed and run locally (`npm test`
  and real API calls) before being considered valid.
# ProyectoM3_WebsterFievre
