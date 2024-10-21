const { Router } = require('express');
const userController = require('../controllers/userController');
const isLoggedInOrMember = require('../utils/authMiddleware').isLoggedInOrMember;

const userRouter = Router();

userRouter.get('/', userController.renderIndex);
userRouter.get('/sign-up', isLoggedInOrMember, userController.getSignUp);
userRouter.post('/sign-up', userController.postSignUp);
userRouter.get('/login', isLoggedInOrMember, userController.getLogin);
userRouter.post('/login', userController.postLogin);
userRouter.get('/logout', userController.postLogout);
userRouter.get('/join-club', userController.getJoinClub);
userRouter.post('/join-club', userController.postJoinClub);

module.exports = userRouter;