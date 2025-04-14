# Steam Game Ownership Checker

A simple backend to check if a user owns a specific game on Steam.

## Setup

1. Clone this repo
2. Create a `.env` file from `.env.example`:
3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
node server.js
```

## Usage

- Redirects to `https://testing-platform-games.github.io/result.html` with `?owned=true/false`
- Accepts a query param `appid` to check any Steam game, e.g.:

```
/auth/steam?appid=413150
```

## Deploy

Works great on Render or Vercel.
