const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');

router.post('/', postCtrl.create);
router.get('/:id', postCtrl.getOnePost);
router.delete('/:id', postCtrl.delete);
router.get('/', postCtrl.getSomePosts);

module.exports = router;