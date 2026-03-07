import app from "./app";
import env from "./shared/configs/env";
import { logger } from "./shared/utils/logger";
import { configureGracefulShutdown } from "./shared/utils/shutdown";

const port = env.PORT || 8080;

const server = app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api/docs`);
});

configureGracefulShutdown(server);
