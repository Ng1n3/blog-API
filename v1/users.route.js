const {Router} = require('express');
const userController = require('../controller/users.controller');
const blogController = require('../controller/blog.controller')
const middleware = require('../middleware/users.middleware');

const router = Router();

router.get('/', userController.home);
router.get('/:blogId', middleware.checkuser, blogController.getOneBlog);
router.post('/signup', middleware.ValidUserCreation, userController.createUser);
router.post('/login', middleware.loginValidation,userController.loginUser);
router.post('/blogs', middleware.checkuser, blogController.createBlog);
router.patch('/blogs/:blogId', middleware.checkuser, blogController.updateBlog)
router.delete('/blogs/:blogId', middleware.checkuser, blogController.deleteBlog)
router.get('/blogs/myblogs', middleware.checkuser, blogController.myBlogs)
module.exports = router;
