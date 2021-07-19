const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

router.post('/', multer, postCtrl.create);
router.get('/:id', postCtrl.getOnePost);
router.delete('/:id', postCtrl.delete);
router.get('/', postCtrl.getSomePosts);

module.exports = router;