const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/:id',auth, userCtrl.delete);
router.put('/:id/description',auth, userCtrl.updateDescription);
router.put('/:id/picture',auth, userCtrl.updatePicture);
router.get('/:id',auth, userCtrl.getOneUser);
router.post('/',auth,  userCtrl.getCurrentUser);

module.exports = router;