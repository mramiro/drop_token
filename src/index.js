import 'dotenv/config';
import express from 'express';

import dropToken from './resources/dropToken';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/drop_token', dropToken);

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

