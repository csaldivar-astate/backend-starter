# Backend Starter

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create your database

```bash
createdb <your-database-name>
```

### 3. Create your `.env` file

Create a file called `.env` in the project root (same level as `package.json`) with the following variables:

```
PORT=<port-number>
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=<your-postgres-username>
DB_PASSWORD=<your-postgres-password>
DB_NAME=<your-database-name>
COOKIE_SECRET=<a-long-random-string>
NODE_ENV=development
```

Replace the `<placeholder>` values with your own:

| Variable        | Description                                                     |
| --------------- | --------------------------------------------------------------- |
| `PORT`          | The port your server runs on (e.g., `3000`)                     |
| `DB_HOST`       | Where PostgreSQL is running (`localhost` for local development) |
| `DB_PORT`       | PostgreSQL's default port (`5432`)                              |
| `DB_USERNAME`   | Your PostgreSQL username                                        |
| `DB_PASSWORD`   | Your PostgreSQL password (leave blank if none)                  |
| `DB_NAME`       | Must match the database you created in step 2                   |
| `COOKIE_SECRET` | Any long random string — used to sign session cookies           |
| `NODE_ENV`      | `development` for local work & `production` for when we deploy  |

> **Do not commit your `.env` file.** It is already in `.gitignore`.

### 4. Compile and run

```bash
npm run compile
npm run start-dev
```

If the server starts without errors, you're good to go.

## Syncing Template Updates

When your instructor announces a template update, run:

```bash
npm run sync
```

This pulls the latest template files and installs any new dependencies. It will **not** touch your own code (controllers, models, entities, validators, etc.).

## Troubleshooting

**`DB_NAME is missing` or similar env error:**

- Make sure `.env` is in the project root, not inside `src/`
- Make sure there are no spaces around the `=` signs
- Make sure there are no quotes around the values

**`connection refused` or `database does not exist`:**

- Make sure PostgreSQL is running
- Make sure `DB_NAME` matches the database you created with `createdb`
- Make sure `DB_USERNAME` and `DB_PASSWORD` are correct

**`role "postgres" does not exist` (macOS):**

- Homebrew installs PostgreSQL with your macOS username as the default role, not `postgres`
- Use your macOS username for `DB_USERNAME` instead

## Available Scripts

| Script              | Description                                       |
| ------------------- | ------------------------------------------------- |
| `npm run compile`   | Compiles TypeScript to JavaScript                 |
| `npm run start-dev` | Starts the server (reloads on file changes)       |
| `npm run sync`      | Pulls latest template files from the starter repo |
