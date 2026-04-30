# Backend Starter

Full-stack starter: Express + TypeScript backend with a SvelteKit frontend.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

This installs both backend and frontend dependencies in one shot (a `postinstall` hook runs `npm install` inside `client/`).

### 2. Create your database

```bash
createdb <your-database-name>
```

### 3. Create your `.env` file

Create a file called `.env` in the project root (same level as `package.json`) with the following variables:

```
PORT=
COOKIE_SECRET=
NODE_ENV=

DB_USERNAME=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_NAME=
DB_SSL_MODE=
```

Replace the `<placeholder>` values with your own:

| Variable        | Description                                                     |
| --------------- | --------------------------------------------------------------- |
| `PORT`          | The port your backend runs on (e.g., `3000`)                    |
| `DB_HOST`       | Where PostgreSQL is running (`localhost` for local development) |
| `DB_PORT`       | PostgreSQL's default port (`5432`)                              |
| `DB_USERNAME`   | Your PostgreSQL username                                        |
| `DB_PASSWORD`   | Your PostgreSQL password (leave blank if none)                  |
| `DB_NAME`       | Must match the database you created in step 2                   |
| `DB_SSL_MODE`   | Set to `require` for hosted databases; leave blank for local    |
| `COOKIE_SECRET` | Any long random string — used to sign session cookies           |
| `NODE_ENV`      | `development` for local work & `production` for when we deploy  |

> **Do not commit your `.env` file.** It is already in `.gitignore`.

### 4. Run the dev server

```bash
npm run dev
```

That single command starts three watchers in parallel:

- **tsc** — recompiles your backend TypeScript on save
- **api** — runs the Express server and restarts on recompile (port from `.env`, e.g. `3000`)
- **web** — runs the Vite dev server for the Svelte frontend with hot-module reload (default port `5173`)

Open **<http://localhost:5173>** for the frontend with HMR. Vite proxies any request starting with `/api` to your Express server automatically.

Press `Ctrl+C` once to stop everything.

## Project Structure

```
backend-starter/
├── src/                    backend (Express + TypeScript)
│   ├── index.ts            app entry + route registration
│   ├── controllers/
│   ├── entities/
│   └── ...
├── client/                 frontend (SvelteKit)
│   ├── src/
│   │   ├── routes/         pages (+page.svelte, +layout.svelte)
│   │   └── lib/            components, API helper, auth & toast stores
│   ├── svelte.config.js
│   └── vite.config.ts
├── frontend/build/         generated on `npm run build:client` — gitignored
├── dist/                   generated on `npm run build:server` — gitignored
└── package.json
```

## Writing Code

- **Backend routes** go in `src/index.ts` (or files you import from it). **Always prefix API routes with `/api`** so Vite's dev proxy forwards them:
  ```ts
  app.post('/api/users', registerUser);
  app.get('/api/me', getMe);
  ```
- **Frontend pages** go under `client/src/routes/`. A file at `client/src/routes/about/+page.svelte` maps to `/about`.
- **Calling your API from a page:**
  ```ts
  import { api } from '$lib/api';
  const user = await api.get('/me'); // GET /api/me
  await api.post('/users', { email, password }); // POST /api/users
  ```
- **Auth state** is available as a rune-based store:
  ```ts
  import { auth } from '$lib/auth.svelte';
  // auth.user, auth.isLoggedIn, auth.refresh()
  ```
- **Toasts:**
  ```ts
  import { toast } from '$lib/toast.svelte';
  toast.success('Saved!');
  ```
- **File upload** with drag-and-drop + file picker:

  ```svelte
  <script lang="ts">
    import FileUpload from '$lib/components/FileUpload.svelte';
    import { uploadFiles } from '$lib/upload';
    import { toast } from '$lib/toast.svelte';

    let files: File[] = $state([]);

    async function submit() {
      try {
        await uploadFiles('/photos', files);
        toast.success('Uploaded!');
        files = [];
      } catch (err) {
        toast.error((err as Error).message);
      }
    }
  </script>

  <FileUpload
    bind:files
    accept="image/*"
    multiple
    maxSize={5 * 1024 * 1024}
    onError={(msg) => toast.error(msg)}
  />
  <button onclick={submit} disabled={files.length === 0}>Upload</button>
  ```

  On the backend, handle the upload with [multer](https://www.npmjs.com/package/multer) (already installed):

  ```ts
  import multer from 'multer';
  const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });
  app.post('/api/photos', upload.array('files'), (req, res) => {
    /* ... */
  });
  ```

## Building for Production

```bash
npm run build     # compiles backend to dist/ AND builds frontend to frontend/build/
npm start         # runs the compiled backend, which also serves the built frontend
```

Then open **<http://localhost:3000>** — Express serves both the API and the Svelte app.

## Syncing Template Updates

When your instructor announces a template update, run:

```bash
npm run sync
```

This pulls the latest template files and installs any new dependencies. It will **not** touch your own code (controllers, models, entities, validators, routes you added, pages you wrote, etc.).

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

**Frontend shows "Not signed in" even after logging in:**

- Make sure you have a `GET /api/me` route that returns the current user
- Make sure your routes are prefixed with `/api`
- Open the browser devtools → Network tab and check that `/api/me` is being proxied to port 3000

## Available Scripts

| Script                 | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `npm run dev`          | Start everything (backend watch + frontend dev server)        |
| `npm run build`        | Build backend and frontend for production                     |
| `npm start`            | Run the production server (serves API + built frontend)       |
| `npm run build:server` | Compile backend TypeScript only                               |
| `npm run build:client` | Build frontend only                                           |
| `npm run dev:client`   | Run the frontend dev server only                              |
| `npm run compile`      | Backend TypeScript watch (legacy — `npm run dev` covers this) |
| `npm run start-dev`    | Run backend with `node --watch` (legacy)                      |
| `npm run sync`         | Pull latest template files from the starter repo              |
