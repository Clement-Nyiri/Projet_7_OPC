const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth')

router.post('/',auth, commentCtrl.create);
router.delete('/:id',auth, commentCtrl.delete);
router.get('/:id',auth, commentCtrl.getAllCommentsOfPost);
router.get('/:id/someComments',auth, commentCtrl.getSomeCommentsOfPost);

module.exports = router;