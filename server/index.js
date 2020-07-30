const app = require('./app');

// app.use((req, res) => { res.status(404).send('Unable to find the requested resource!'); });

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('App listening on port 3000!');
});
