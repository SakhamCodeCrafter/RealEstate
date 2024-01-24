const Listing = require("../models/listing.js");
const errorHandler = require("../util/error.js");

const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

const handleListingNotFound = (listing, req, next) => {
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only modify your own listings!"));
  }
};

const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  const { id } = req.params;

  try {
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedListing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json({ success: true, data: updatedListing });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getListing = async (req, res, next) => {
  try {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
      return handleListingNotFound(req, res, next);
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};



module.exports = {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
};
