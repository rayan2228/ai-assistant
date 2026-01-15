import type { Request, Response } from "express";
import {
  googleCallBackService,
  googleLoginService,
} from "../services/auth.service";

const googleLoginController = async (req: Request, res: Response) => {
  const url = await googleLoginService();
  res.redirect(url);
};

const googleCallBackController = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const tokens = await googleCallBackService(code);
  res.send(tokens);
};
export { googleCallBackController, googleLoginController };
