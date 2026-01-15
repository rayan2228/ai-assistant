import { google } from "googleapis";
import crypto from "crypto";
import { config } from "../config";

const createOAuthClient = () =>
  new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    config.GOOGLE_OAUTH_CALLBACK_URL
  );

export const googleLoginService = async () => {
  const oauth2Client = createOAuthClient();

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: config.GOOGLE_OAUTH_SCOPES,
    state: crypto.randomUUID(),
  });
};

export const googleCallBackService = async (code: string) => {
  const oauth2Client = createOAuthClient();

  const { tokens } = await oauth2Client.getToken(code);

  // Save refresh token ONCE
  if (tokens.refresh_token) {
    // store in DB
  }

  return tokens;
};
