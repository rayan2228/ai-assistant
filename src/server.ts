import cors from "cors";
import express from "express";
import helmet from "helmet";
import callAssistant from "./ai/assistant";
import authRouter from "./routes/auth.route";
export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/v1", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/chat", async (req, res) => {
  const data = await callAssistant();
  res.json({ data });
});
