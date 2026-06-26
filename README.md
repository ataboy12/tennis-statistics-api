# Tennis Statistics API

A small REST API for managing tennis players and computing statistics about them. Built with **Express 5**, **TypeScript**, and **Zod** for request validation, following a layered architecture (routes → controllers → services → repositories).

## Requirements

- Node.js 20+
- npm

## Installation

```bash
npm install
```

## Running the app

```bash
# Development (auto-reload via tsx)
npm run dev

# Production build + start
npm run build
npm start
```

The server listens on port `3000` by default. Override with the `PORT` environment variable:

```bash
PORT=8080 npm run dev
```

Once running, check it's alive:

```bash
curl http://localhost:3000/health
# { "status": "ok" }
```

## API endpoints

Base URL: `http://localhost:3000`

| Method | Path             | Description                                    |
| ------ | ---------------- | ---------------------------------------------- |
| GET    | `/health`        | Health check.                                  |
| GET    | `/players`       | List all players, sorted by rank (best first). |
| GET    | `/players/stats` | Aggregated statistics (see below).             |
| GET    | `/players/:id`   | Get a single player by id.                     |
| POST   | `/players`       | Create a new player.                           |
| PATCH  | `/players/:id`   | Partially update an existing player.           |
| DELETE | `/players/:id`   | Delete a player by id.                         |

### Statistics (`GET /players/stats`)

Returns:

- `countryWithBestWinRatio` — the country code with the highest win ratio across recent matches, plus the ratio.
- `averageBmi` — average Body Mass Index of all players.
- `medianHeight` — median player height (cm).

```json
{
	"countryWithBestWinRatio": { "code": "SRB", "ratio": 1.0 },
	"averageBmi": 23.45,
	"medianHeight": 185
}
```

### Creating a player (`POST /players`)

The request body is validated with Zod. All fields are required:

```bash
curl -X POST http://localhost:3000/players \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Rafael",
    "lastname": "Nadal",
    "shortname": "R.NAD",
    "sex": "M",
    "country": { "picture": "https://example.com/flag.png", "code": "ESP" },
    "picture": "https://example.com/player.png",
    "data": {
      "rank": 1,
      "points": 1000,
      "weight": 85000,
      "height": 185,
      "age": 37,
      "last": [1, 0, 1, 1]
    }
  }'
```

Field rules:

| Field             | Type           | Constraints             |
| ----------------- | -------------- | ----------------------- |
| `firstname`       | string         | non-empty               |
| `lastname`        | string         | non-empty               |
| `shortname`       | string         | non-empty               |
| `sex`             | `"M"` \| `"F"` | enum                    |
| `country.picture` | string         | valid URL               |
| `country.code`    | string         | exactly 3 characters    |
| `picture`         | string         | valid URL               |
| `data.rank`       | number         | positive integer        |
| `data.points`     | number         | non-negative integer    |
| `data.weight`     | number         | positive (grams)        |
| `data.height`     | number         | positive (cm)           |
| `data.age`        | number         | positive integer        |
| `data.last`       | array          | each item is `0` or `1` |

### Updating a player (`PATCH /players/:id`)

Send only the fields you want to change. Nested objects (`country`, `data`) are merged, so partial nested updates are allowed. At least one field must be present.

```bash
curl -X PATCH http://localhost:3000/players/52 \
  -H "Content-Type: application/json" \
  -d '{ "data": { "rank": 1, "points": 12030 } }'
```

Returns `200` with the full updated player.

### Deleting a player (`DELETE /players/:id`)

```bash
curl -X DELETE http://localhost:3000/players/52
```

Returns `204 No Content` on success.

An invalid body returns `400` with a validation error; an unknown id on `GET`, `PATCH`, or `DELETE` of `/players/:id` returns `404`.

> **Note:** Player data is stored in memory (seeded from `src/data/players.json`). Created players persist only until the server restarts.

## Testing

Tests are written with **Jest** and **ts-jest** (plus **supertest** for HTTP-level tests).

```bash
# Run the full suite
npm test

# Run with coverage
npm test -- --coverage

# Run a single file
npm test -- player.service.test.ts

# Watch mode
npm test -- --watch
```

Test files live under `src/tests/` and match the pattern `**/tests/**/*.test.ts`.

## Project structure

```
src/
├── app.ts                 # Express app
├── server.ts              # Entry point (starts the HTTP server)
├── controllers/           # Request/response handling + validation
├── services/              # Business logic (sorting, statistics)
├── repositories/          # Data access
├── routes/                # Express route definitions
├── middlewares/           # Error handler
├── validation/            # Zod schemas
├── types/                 # Domain types
├── data/                  # Seed data
└── tests/                 # Jest test suites
```
