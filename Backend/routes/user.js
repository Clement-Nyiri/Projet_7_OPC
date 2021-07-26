const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/:id', userCtrl.delete);
router.put('/:id/description', userCtrl.updateDescription);
router.put('/:id/picture', userCtrl.updatePicture);
router.get('/:id', userCtrl.getOneUser);

module.exports = router;