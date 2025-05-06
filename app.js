require('dotenv').config();

const express = require('express');
const auth = require('basic-auth');
const app = express();

console.log('Loaded USERNAME from .env:', process.env.USERNAME);
console.log('Loaded PASSWORD from .env:', process.env.PASSWORD);
console.log('Loaded SECRET_MESSAGE from .env:', process.env.SECRET_MESSAGE);

app.get('/', (req, res) => {
  res.send('Node js says Hello, world!');
});

app.get('/env-check', (req, res) => {
  res.send(`Your secret message is: ${process.env.SECRET_MESSAGE}`);
});

app.get('/secret', (req, res) => {
	const user = auth(req);

  if (user && user.name === process.env.USERNAME && user.pass === process.env.PASSWORD){
    res.send(process.env.SECRET_MESSAGE);
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Secret Area"');
    res.status(401).send('Access denied');
  }
}
);

console.log('Current directory:', process.cwd());


app.listen(3000, () => {
  console.log('server running on port 3000');
});
