import express from 'express';

console.log(`Current environment: ${process.env.NODE_ENV}.`);

const app = express();

app.use(express.static('./client'));

export default app;
