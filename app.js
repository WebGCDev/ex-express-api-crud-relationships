const express = require('express');
const app = express();
// importa file di routing per i post/categorie/tag, contengono le definizioni degli endpoint per gestire le richieste
const postRoutes = require('./routes/post');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');

app.use(express.json()); //middleware
app.use((req, res, next) => {
  //aggiunge middleware e passa la richiesta al middleware successivo
  console.log(`${req.method} ${req.url}`);
  next();
});

//ogni richiesta che inizia con '/api' sarà gestita dai rispettivi router

app.use('/api', postRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);

// rotta non trovata
app.use((req, res, next) => {
  res.status(404).json({ error: 'Rotta non trovata' });
});

module.exports = app;
