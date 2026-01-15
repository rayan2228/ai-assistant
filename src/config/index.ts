const {
  PORT,
  APP_URL,
  GOOGLE_OAUTH_CALLBACK_URL,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
} = process.env;
const _config = {
  PORT,
  APP_URL: APP_URL || `http://localhost:${PORT}`,
  GOOGLE_OAUTH_CALLBACK_URL,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_OAUTH_SCOPES: ["https://www.googleapis.com/auth/calendar"],
};

export const config = Object.freeze(_config);
