import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';

const isProduction = process.env.NODE_ENV === 'production';

const PostgresStore = connectPgSimple(session);

// Store sessions in PostgreSQL
const sessionStorage = new PostgresStore({
  createTableIfMissing: true,
  conString: `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
});

const sessionMiddleware = session({
  store: sessionStorage,
  secret: process.env.COOKIE_SECRET, // Signs cookie to prevent forgery
  cookie: {
    maxAge: 8 * 60 * 60 * 1000, // 8-hour session expiry
    httpOnly: true, // No client-side JS access (XSS protection)
    secure: isProduction, // HTTPS only in production
    sameSite: 'lax', // Basic CSRF protection
  },
  name: 'session', // Cookie name in the browser
  resave: false, // Skip re-saving unmodified sessions
  saveUninitialized: false, // Don't save empty sessions (no cookie until session is used)
});

export { sessionMiddleware };
