# GMAT Practice Log

A local-first study tracker for recording GMAT-style questions, attempts, errors, review state, and mock-test results. It is a Next.js application backed by Prisma and SQLite, with optional local or OpenAI-compatible assistance for explanations.

## Features

- Maintain a question bank with section, topic, difficulty, source, prompt, answer, and notes.
- Record timed attempts and whether each answer was correct.
- Attach error tags such as concept, setup, arithmetic, timing, or careless mistakes.
- Build a review queue from mastery and spaced-review state.
- Record mock-test section and score summaries.
- Import/export question data as JSON and export attempt history as CSV.
- Use an optional Ollama endpoint or an explicitly configured OpenAI-compatible provider for study assistance.

The included seed content consists of original placeholder GMAT-style practice records. It does not include official exam questions.

## Stack

- Next.js App Router and React
- TypeScript and Tailwind CSS
- Prisma ORM
- Local SQLite database

```text
browser -> Next.js routes/actions -> Prisma -> local SQLite file
                         +-------> optional model provider
```

## Setup

Requirements: Node.js 20+.

```bash
npm install
copy .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

The default database URL points to a local development database. Database files and `.env` are ignored.

Useful commands:

```bash
npm run typecheck
npm run build
npm run db:migrate
npm run db:seed
```

## Model-provider configuration

Model assistance is optional. Ollama is intended for local inference. If an OpenAI-compatible endpoint is configured, prompts and any included study material leave the computer. Store provider keys only in `.env`, review the selected model's terms and cost, and avoid uploading proprietary exam material.

## Privacy and exam-content boundary

Study history can reveal performance, schedules, and source material. It stays in the local SQLite database unless the user exports it or enables a remote provider. Do not commit databases or exports containing personal study data.

This project is unaffiliated with the Graduate Management Admission Council. GMAT is a trademark of its owner. Users are responsible for respecting exam rules and content licenses.

## License

Original source and placeholder records are MIT licensed. Frameworks and dependencies retain their upstream licenses.
