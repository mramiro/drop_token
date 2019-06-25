import 'dotenv/config';
import express from 'express';
import router from './router';

const app = express();
const port = process.env.PORT || 3000;

app.use('/drop_token', router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

