const express = require('express');

const bookRouter = express.Router();

function router(nav) {
  const books = [
    {
      title: 'Eloquent JavaScript, Second Edition',
      author: 'Marijn Haverbeke',
      publisher: 'No Starch Press',
      read: false,
    },
    {
      title: 'Learning JavaScript Design Patterns',
      author: 'Addy Osmani',
      publisher: "O'Reilly Media",
      read: true,
    },
    {
      title: 'Speaking JavaScript',
      author: 'Axel Rauschmayer',
      publisher: "O'Reilly Media",
      read: false,
    },
    {
      title: 'Programming JavaScript Applications',
      author: 'Eric Elliott',
      publisher: "O'Reilly Media",
      read: false,
    },
    {
      title: 'Understanding ECMAScript 6',
      author: 'Nicholas C. Zakas',
      publisher: 'No Starch Press',
      read: false,
    },
    {
      title: "You Don't Know JS",
      author: 'Kyle Simpson',
      publisher: "O'Reilly Media",
      read: false,
    },
    {
      title: 'Git Pocket Guide',
      author: 'Richard E. Silverman',
      publisher: "O'Reilly Media",
      read: false,
    },
    {
      title: 'Designing Evolvable Web APIs with ASP.NET',
      author: 'Glenn Block, et al.',
      publisher: "O'Reilly Media",
      read: false,
    },
  ];

  bookRouter.route('/')
    .get((req, res) => {
      res.render('book-list', {
        title: 'Book List',
        nav,
        books,
      });
    });

  bookRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;

      res.render('book', {
        title: 'Single Book',
        nav,
        book: books[id],
      });
    });

  return bookRouter;
}

module.exports = router;
