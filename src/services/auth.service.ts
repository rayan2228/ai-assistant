import crypto from "crypto";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { User } from "../models/user.model";
export const oauth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  config.GOOGLE_OAUTH_CALLBACK_URL
);

export const googleLoginService = async () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: config.GOOGLE_OAUTH_SCOPES,
    state: crypto.randomUUID(),
  });
};

export const googleCallBackService = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Get Google profile info ONCE
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });

  const { data } = await oauth2.userinfo.get();

  // Find or create user
  let user = await User.findOne({ googleId: data.id });

  if (!user) {
    user = await User.create({
      googleId: data.id,
      email: data.email,
      name: data.name,
      avatar: data.picture,
    });
  }

  // Save refresh token once
  if (tokens.refresh_token) {
    user.googleRefreshToken = tokens.refresh_token;
    await user.save();
  }

  // Issue YOUR token
  const appToken = jwt.sign(
    { userId: user.id, email: user.email, googleId: user.googleId },
    config.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return {
    token: appToken,
    user: data,
    tokens,
  };
};
