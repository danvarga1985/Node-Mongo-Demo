const path = require('path');

const express = require('express');
const db = require('./db');

const productRoutes = require('./routes/products');

const app = express();


// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET,POST,PUT,PATCH,DELETE,OPTIONS'
//   );
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

app.use('/products', productRoutes);

db.initDb((err, db) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(3100);
  }
});