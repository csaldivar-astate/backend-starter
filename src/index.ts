import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors

import express from 'express';

const app = express();
app.use(express.static('public', { extensions: ['html'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.listen(process.env.PORT, () => {
  console.log(`Server started http://localhost:${process.env.PORT}`);
});
