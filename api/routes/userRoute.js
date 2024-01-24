const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const  verifyToken = require('../util/verifyToken.js');

router.get('/test', userController.test);
router.post('/update/:id', verifyToken, userController.updateUser);
router.delete('/delete/:id', verifyToken, userController.deleteUser);
router.get('/listings/:id', verifyToken, userController.getUserListings);
router.get('/:id', verifyToken, userController.getUser);
router.post('/submitForm', userController.submitForm);
module.exports = router;



