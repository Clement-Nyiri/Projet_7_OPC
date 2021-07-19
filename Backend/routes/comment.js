const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');

router.post('/', commentCtrl.create);
router.delete('/:id', commentCtrl.delete);
router.get('/:id', commentCtrl.getAllCommentsOfPost);

module.exports = router;