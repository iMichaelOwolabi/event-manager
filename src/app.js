import express from 'express';
import { config } from 'dotenv';
import { redisClient } from './db/index.js';

config();

const app = express();

app.use(express.json());

const port = process.env.PORT ?? 3000;

app.get('', (req, res) => {
  res.send('Welcome to the event management platform built on redis');
});

app.listen(port, () => {
  console.log(`Server running on: http://localhost:${port}`);
});
