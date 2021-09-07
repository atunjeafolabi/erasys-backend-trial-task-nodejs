import 'reflect-metadata';
import app from './bootstrap/app';
// import express from 'express';
// import router from './api/routes';

require('dotenv').config();

// const app = express();

// Parse incoming JSON data
// app.use(express.json());

const port = process.env.APP_PORT || 3000;

// app.use('/', router);

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
