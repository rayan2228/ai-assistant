const {
  PORT,
  APP_URL,
  GOOGLE_OAUTH_CALLBACK_URL,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  JWT_SECRET,
} = process.env;
const _config = {
  PORT,
  APP_URL: APP_URL || `http://localhost:${PORT}`,
  GOOGLE_OAUTH_CALLBACK_URL,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_OAUTH_SCOPES: [
    "openid",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ],
  JWT_SECRET,
};

export const config = Object.freeze(_config);
