import app from "./app.js";
import connectDB from "./config/db.js";
import { PORT, SERVICE } from "./utils/constant.js";

import logger from "./utils/logger.js";

app.listen(PORT, async () => {
  try {
    await connectDB();
    logger.success(SERVICE, `Server running on http://localhost:${PORT}`);
  } catch (error) {
    logger.error(SERVICE, `Server failed to start → ${error.message}`);
  }
});
