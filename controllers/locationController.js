const Location = require('../models/Location')
const User = require('../models/User')
const Locations = require('../models/Location')
const mongoose = require('mongoose');
const { uploads } = require("../middleware/cloudinaryconfig")
const fs = require("fs")

const addLocation = async (req, res) => {
    const { name, latitude, longitude, experienceType, preference, price, persons, username, moodBased, timeOfDay,modeOfTransport,recommendation,locationType } = req.body;
    try {
        // console.log("the username is", username)
        let userExists = await User.findOne({ username });
        // console.log(userExists);
        if (!userExists) {
            return res.status(400).json({ message: 'The user is not found' });
        }
        console.log('User found:', userExists._id);
        let imageUrl = '';
        let imageId = '';
        if (req.file) {
            // Upload the file using your helper
            const result = await uploads(req.file.path, 'locations'); // 'locations' = folder in Cloudinary
            console.log('Image uploaded to Cloudinary:', result);
            imageUrl = result.url;
            imageId = result.id;

            // Clean up temp file
            fs.unlinkSync(req.file.path);
        }
        const newLocation = await Location.create({
            name, location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }, experienceType, preference, price, persons, moodBased, timeOfDay, User: userExists._id, image: {
                url: imageUrl,
                public_id: imageId
            },modeOfTransport,recommendation,locationType
        });
        console.log('New location created:', newLocation._id);
        res.status(201).json(newLocation);

    }
    catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
        return res.status(500).json({ message: 'Something went wrong' });
    }

}
const getLocations = async (req, res) => {
    try {
        let { username } = req.body;
        let userExists = await User.findOne({ username });
        if (!userExists) return res.status(400).json({ message: "User does not Exists" });

        const userId = userExists._id;
        const locations = await Locations.find({ User: userId })
        // console.log(locations)
        res.json({ locations: locations });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "the error occured is", error })
    }

}
module.exports = { addLocation, getLocations }