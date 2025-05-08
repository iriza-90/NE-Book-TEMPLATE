const { Book } = require('../models');
const { Op, Sequelize } = require('sequelize');

// Get all books (user-specific, with pagination)
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Book.findAndCountAll({
      where: { userId: req.user.id },
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      total: count,
      page: parseInt(page),
      books: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single book by ID (user-specific)
exports.getById = async (req, res) => {
  try {
    const book = await Book.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new book (attach to current user)
exports.create = async (req, res) => {
  try {
    const { bookName, Author, Publisher, Subject, Publication_year } = req.body;

    if (!bookName || !Author) {
      return res.status(400).json({ error: 'bookName and Author are required' });
    }

    const book = await Book.create({
      bookName,
      Author,
      Publisher,
      Subject,
      Publication_year,
      userId: req.user.id
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a book (only if it belongs to current user)
exports.update = async (req, res) => {
  try {
    const [updated] = await Book.update(req.body, {
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (updated === 0) {
      return res.status(404).json({ error: 'Book not found or not authorized' });
    }

    const updatedBook = await Book.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a book (only if it belongs to current user)
exports.delete = async (req, res) => {
  try {
    const deleted = await Book.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Book not found or not authorized' });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search books (user-specific)
exports.search = async (req, res) => {
  try {
    const { q } = req.query;

    const books = await Book.findAll({
      where: {
        userId: req.user.id,
        [Op.or]: [
          { bookName: { [Op.iLike]: `%${q}%` } },
          { Author: { [Op.iLike]: `%${q}%` } },
          { Publisher: { [Op.iLike]: `%${q}%` } },
          { Subject: { [Op.iLike]: `%${q}%` } },
          Sequelize.where(
            Sequelize.cast(Sequelize.col('Publication_year'), 'TEXT'),
            { [Op.iLike]: `%${q}%` }
          )
        ]
      }
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
