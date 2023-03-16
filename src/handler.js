const { nanoid } = require('nanoid');
const books = require('./books');

const checkPage = (pageCount, readPage) => pageCount < readPage;

const addBook = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = parseInt(pageCount) === parseInt(readPage);

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!newBook.name || newBook.name === undefined || newBook.name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  } if (checkPage(newBook.pageCount, newBook.readPage)) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  } if (newBook.name && !checkPage(newBook.pageCount, newBook.readPage)) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    books.push(newBook);

    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan. Lengkapi data terlebih dahulu!',
  });

  response.code(500);
  return response;
};

const getAllBooks = (req, h) => {
  let bookData = [];
  if (books.length !== 0) {
    bookData = books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
  }
  const response = h.response({
    status: 'success',
    data: {
      books: bookData,
    },
  });
  response.code(200);
  return response;
};

const getBookById = (req, h) => {
  const { bookId } = req.params;

  const book = books.filter((bo) => bo.id === bookId)[0];

  if (book) {
    const response = h.response({
      status: 'success',
      data: { book },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBook = (req, h) => {
  const { bookId } = req.params;

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  let idCheck = '';
  for (const i in books) {
    if (books[i].id === bookId) {
      idCheck = i;
    }
  }

  if (!idCheck || idCheck === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    response.code(404);
    return response;
  }

  if (!name || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (checkPage(pageCount, readPage)) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  response.code(200);
  return response;
};

const deleteBook = (req, h) => {
  const { id } = req.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBook,
  getBookById,
  updateBook,
  deleteBook,
  getAllBooks,
};
