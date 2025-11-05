import { app } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

(async () => {
  await connectDB();
  app.listen(Number(env.PORT), () => {
    console.log(`API running on :${env.PORT}`);
  });
})();
