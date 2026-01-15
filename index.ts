import { config } from "./src/config";
import { app } from "./src/server";

app.listen(config.PORT, () =>
  console.info(`server is running: ${config.APP_URL}`)
);
