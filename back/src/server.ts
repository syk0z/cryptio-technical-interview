/* eslint-disable camelcase */
import express from 'express';
import cors from 'cors';
import routes from './routers/index';

const app = express();

// Enable CORS for *
app.use(cors());

app.use(routes);

app.get('/ping', async (_, res) => {
  res.json('pong');
});

const port = 8080;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Server listening on port ${port} (${process.env.NODE_ENV ?? 'unknown environment'})`,
  );
});
