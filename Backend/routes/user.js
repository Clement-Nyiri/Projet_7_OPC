const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/:id', userCtrl.delete);
router.put('/:id/description', userCtrl.updateDescription);
router.put('/:id/picture', multer, userCtrl.updatePicture);
router.get('/:id', userCtrl.getOneUser);

module.exports = router;