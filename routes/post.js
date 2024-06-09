const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const validator = require("../middlewares/validator");
const validation= require ('../validations/posts');

router.get('/posts', postController.getPosts);
router.post('/posts', validator(validation.bodyData) ,postController.createPost);
router.get('/posts/:slug', postController.getPostBySlug);
router.put('/posts/:slug', validator(validation.bodyData) ,postController.updatePost);
router.delete('/posts/:slug', postController.deletePost);

module.exports = router;
