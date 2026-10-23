const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blogsController');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', verifyToken, blogsController.getAllBlogs);
router.get('/:id', verifyToken, blogsController.getBlogById);
router.post('/', verifyToken, upload.single('image'), blogsController.createBlog);
router.put('/:id', verifyToken, upload.single('image'), blogsController.updateBlog);
router.delete('/:id', verifyToken, blogsController.deleteBlog);

module.exports = router;
