const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');

router.post('/', postCtrl.create);
router.put('/:id', postCtrl.update);
router.get('/', postCtrl.getAllPost);
router.get('/:id', postCtrl.getOnePost);
router.get('/:id/comments', postCtrl.getSomeComments);
router.delete('/:id', postCtrl.delete);

module.exports = router;