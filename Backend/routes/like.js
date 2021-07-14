const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/like');
const auth = require('../middleware/auth');

router.post('/', auth, likeCtrl.postLike);
router.get('/', auth, likeCtrl.getLikes);

module.exports = router;