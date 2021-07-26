const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/like');

router.post('/', likeCtrl.postLike);
router.get('/:id', likeCtrl.getLikes);

module.exports = router;