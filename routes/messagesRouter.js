const { Router } = require('express');
const messagesController = require('../controllers/messagesController');
const isAdmin = require('../utils/authMiddleware').isAdmin;
const isAuth = require('../utils/authMiddleware').isAuth;

const messagesRouter = Router();

messagesRouter.get('/new', isAuth, messagesController.getNewMessageForm);
messagesRouter.post('/new', messagesController.createNewMessage);
messagesRouter.post('/:id/delete', isAdmin, messagesController.deleteMessage);

module.exports = messagesRouter;