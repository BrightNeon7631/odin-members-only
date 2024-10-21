const db = require('../db/queries');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

const validateMessage = [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters.'),
  body('text')
    .isLength({ min: 1, max: 250 })
    .withMessage('Message must be between 1 and 250 characters.'),
];

const getNewMessageForm = (req, res) => {
  res.render('message-form', { user: req.user });
};

const createNewMessage = [
  validateMessage,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('message-form', {
        errors: errors.array(),
      });
    }
    const { title, text } = req.body;
    const currentDate = new Date();
    await db.queryCreateNewMessage(title, text, currentDate, req.user.id);
    res.redirect('/');
  }),
];

const deleteMessage = asyncHandler(async (req, res) => {
    const messageID = req.params.id;
    await db.queryDeleteMessage(messageID);
    res.redirect('/');
});

module.exports = {
  getNewMessageForm,
  createNewMessage,
  deleteMessage
};