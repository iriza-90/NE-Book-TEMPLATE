const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyToken } = require('../middlewares/auth');

// Protect all routes
router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of books
 */
router.get('/', bookController.getAll);

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: Matching books
 */
router.get('/search', bookController.search);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a single book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book details
 */
router.get('/:id', bookController.getById);

/**
 * @swagger
 * /books/create:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookName:
 *                 type: string
 *               Author:
 *                 type: string
 *               Publisher:
 *                 type: string
 *               Subject:
 *                 type: string
 *               Publication_year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Book created
 */
router.post('/create', bookController.create);

/**
 * @swagger
 * /books/update/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookName:
 *                 type: string
 *               Author:
 *                 type: string
 *               Publisher:
 *                 type: string
 *               Subject:
 *                 type: string
 *               Publication_year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Book updated
 */
router.put('/update/:id', bookController.update);

/**
 * @swagger
 * /books/delete/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Book deleted successfully
 */
router.delete('/delete/:id', bookController.delete);

module.exports = router;
