import { config } from "./src/config";
import { connectDB } from "./src/db";
import { app } from "./src/server";

(async () => {
  await connectDB();
  app.listen(config.PORT, () =>
    console.info(`server is running: ${config.APP_URL}`)
  );
})();
