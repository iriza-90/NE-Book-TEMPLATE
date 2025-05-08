const Joi = require('joi');

const bookSchema = Joi.object({
  bookName: Joi.string().min(2).required(),
  Author: Joi.string().min(2).required(),
  Publisher: Joi.string().min(2).optional(),
  Subject: Joi.string().optional(),
  Publication_year: Joi.number().integer().min(1000).max(9999).optional()
});

module.exports = (req, res, next) => {
  const { error } = bookSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
