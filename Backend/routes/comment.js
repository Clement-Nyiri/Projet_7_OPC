const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');

router.post('/', commentCtrl.create);
router.delete('/:id', commentCtrl.delete);
router.get('/:id', commentCtrl.getAllCommentsOfPost);
router.get('/:id/someComments', commentCtrl.getSomeCommentsOfPost);

module.exports = router;