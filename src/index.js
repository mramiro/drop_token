import 'dotenv/config';
import express from 'express';

import dropToken from './resources/dropToken';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/drop_token', dropToken);

app.use((req, res) => {
  res.status(404).send();
});

app.use((err, req, res, next) => {
  const status = err.status || 400;
  res.status(400).send();
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

