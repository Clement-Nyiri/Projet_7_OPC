const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth')

router.post('/',auth, multer, postCtrl.create);
router.get('/:id',auth, postCtrl.getOnePost);
router.delete('/:id',auth, postCtrl.delete);
router.get('/',auth, postCtrl.getSomePosts);

module.exports = router;