import "./config/env.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

app
  .listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  });
