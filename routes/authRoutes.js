const express = require('express');
const {register,login} = require('../controllers/authController');
const { authenticateToken, authorizeAdmin } = require('../middleware/middleware');
const {createGroup} = require('../controllers/groupController')
const {addLocation,getLocations,editLocation} = require('../controllers/locationController')
const {sendFriendRequest,getFriendLocations,searchFriends,getFriends,getFriendRequests,acceptFriendRequest,createTrip,addLocationToTrips,getTrip,getTrips,getTripMessages} = require('../controllers/friendController')
const router = express.Router();
const upload = require("../middleware/multer")

// console.log("inside he auth file")
router.post('/register',register);
router.post('/login',login);
router.post('/add-location',authenticateToken,upload.single('image'),addLocation);
router.post('/edit-location',authenticateToken,upload.single('image'),editLocation);
router.post('/get-locations',authenticateToken,getLocations);
router.post('/create-group',authenticateToken,createGroup);
router.post('/add-friend',authenticateToken,sendFriendRequest);
router.post('/search-friends',authenticateToken,searchFriends);
router.post('/get-friend-requests',getFriendRequests)
router.post('/accept-friend-request',acceptFriendRequest)
router.post('/get-friends-location',authenticateToken,getFriendLocations)
router.post('/get-friends',getFriends);
router.post('/create-trip',authenticateToken,upload.single('image'),createTrip);
router.post('/add-location-to-trips',authenticateToken,addLocationToTrips);
router.post('/get-trips',getTrips);
router.post('/get-trip',getTrip);
router.post('/get-trip-messages',getTripMessages)




module.exports = router;