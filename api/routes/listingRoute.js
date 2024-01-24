const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');

router.post('/create', listingController.createListing);
router.get('/get/:id', listingController.getListing);
router.get('/get', listingController.getListings);

module.exports = router;
