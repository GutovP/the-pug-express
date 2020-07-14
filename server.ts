import express from 'express';

import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

const app = express();

app.set('view engine', 'pug');

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/libs', express.static(path.join(__dirname, 'node_modules')));

// when using json
app.use(bodyParser.json());

// when using forms
app.use(bodyParser.urlencoded({ extended: true }));

const logger = morgan('combined', {
  stream: fs.createWriteStream(path.join(__dirname, 'logs.log'), {
    flags: 'a',
  }),
});

app.use(logger);

const books = [];

app.get('/', (req, res) => {
  const model = {
    model: books,
  };
  res.render('home/index', model);
});

app.get('/books/add', (req, res) => {
  res.render('books/book-add');
});

app.get('/books/:id', (req, res) => {
  const id = +req.params.id;
  const book = books.find((b) => b.id === id);
  const model = {
    model: book,
  };
  if (book === null) {
    return res.status(404).send({ error: 'Book not found' });
  }

  return res.render('books/book', model);
});

// POST /books
app.post('/books', (req, res) => {
  const body = req.body;
  let book = {
    id: books.length + 1,
    title: body.title,
  };

  books.push(book);
  res.redirect('/');
});

// localhost:3200
app.listen(3200, () => console.log('Magic happens at: 3200'));
