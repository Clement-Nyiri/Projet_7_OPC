const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/like');
const auth = require('../middleware/auth');

router.post('/', likeCtrl.postLike);
router.get('/:id', likeCtrl.getLikes);

module.exports = router;