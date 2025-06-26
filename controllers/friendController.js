const User = require("../models/User")
const Location = require("../models/Location")
const Trip = require("../models/Trip")
const Message = require("../models/Message")
const fs = require("fs")
const { uploads } = require("../middleware/cloudinaryconfig")

const sendFriendRequest = async (req, res) => {
    try {
        const { username, friendUsername } = req.body;

        if (username === friendUsername) {
            return res.status(400).json({ error: "You can't add yourself as a friend." });
        }

        const sender = await User.findOne({ username });
        if (!sender) return res.status(404).json({ error: 'User not found' });

        const receiver = await User.findOne({ username: friendUsername });
        if (!receiver) return res.status(404).json({ error: 'Friend user not found' });

        if (sender.friends.includes(receiver._id)) {
            return res.status(400).json({ error: 'User is already your friend' });
        }
        // console.log("the receiver is", receiver)
        if (receiver.friendRequests.includes(sender._id)) {
            return res.status(400).json({ error: 'Friend request already sent' });
        }

        await User.findByIdAndUpdate(
            receiver._id,
            { $addToSet: { friendRequests: sender._id } },
            { new: true }
        );

        res.status(201).json({ message: 'Friend request sent successfully' });

    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const acceptFriendRequest = async (req, res) => {
    try {
        const { username, friendUsername } = req.body;

        const user = await User.findOne({ username });
        const friend = await User.findOne({ username: friendUsername });

        if (!user || !friend) {
            return res.status(404).json({ error: 'User(s) not found' });
        }

        if (!user.friendRequests.includes(friend._id)) {
            return res.status(400).json({ error: 'No friend request found from this user' });
        }

        await Promise.all([
            User.updateOne(
                { _id: user._id },
                {
                    $addToSet: { friends: friend._id },
                    $pull: { friendRequests: friend._id }
                }
            ),
            User.updateOne(
                { _id: friend._id },
                {
                    $addToSet: { friends: user._id }
                }
            )
        ]);

        res.status(200).json({ message: 'Friend request accepted' });

    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getFriendRequests = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username: username }).populate('friendRequests');
        if (!user) return res.status(404).json({ error: 'User not found' });
        // console.log(user)
        let friendRequestUsernames = [];
        user.friendRequests.map((friend) => [
            friendRequestUsernames.push(friend.username)
        ])


        return res.json({ friendRequestUsernames })
    }
    catch (error) {
        console.error("the error occurred in find request is", error)
    }
}

const getFriendLocations = async (req, res) => {
    try {
        const { username } = req.body;

        const user = await User.findOne({ username: username }).populate('friends');
        if (!user) return res.status(404).json({ error: 'User not found' });

        let userFriends = user.friends;
        userFriends.push(user);
        // console.log("the friends are", userFriends)
        const locationsArrays = await Promise.all(
            userFriends.map(friend => Location.find({ User: friend._id }))
        );
        const locations = locationsArrays.flat();

        return res.json({ locations });

    }
    catch (error) {
        console.error("the error occurred in location is", error)
    }

}

const searchFriends = async (req, res) => {
    try {
        let { username } = req.body;
        const friends = await User.find({ username: username });
        return res.json({ friends });
    }
    catch (error) {
        console.error("the error searching friends is", error);
    }
}

const getFriends = async (req, res) => {
    try {
        const { username } = req.body;

        const user = await User.findOne({ username: username }).populate('friends');
        if (!user) return res.status(404).json({ error: 'User not found' });

        let userFriends = user.friends;
        // console.log("the friends are", userFriends)
        return res.json({ userFriends });

    }
    catch (error) {
        console.error("the error occurred in location is", error)
    }
}

const createTrip = async (req, res) => {
    try {
        const { name, members, createdBy } = req.body;
        if (!name || !members || !Array.isArray(members) || members.length === 0) {
            return res.status(400).json({ message: 'Trip name and members are required.' });
        }
        const createdUser = await User.findOne({ username: createdBy });
        const users = await User.find({ username: { $in: members } });
        // console.log("the users are",users)
        if (users.length !== members.length) {
            return res.status(404).json({ message: 'One or more members not found.' });
        }
        let imageUrl = '';
        let imageId = '';
        if (req.file) {
            // Upload the file using your helper
            const result = await uploads(req.file.path, 'trips'); // 'locations' = folder in Cloudinary
            console.log('Image uploaded to Cloudinary:', result);
            imageUrl = result.url;
            imageId = result.id;

            // Clean up temp file
            fs.unlinkSync(req.file.path);
        }
        const memberIds = users.map(user => user._id)
        console.log("the createdBy username is", createdUser)
        const trip = new Trip({
            createdBy: createdUser._id,
            name,
            members: memberIds, 
            image: {
                url: imageUrl,
                public_id: imageId
            }
        });
        console.log("the trip is",trip)

        await trip.save();

        return res.status(201).json({ message: 'Trip created successfully', trip });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error in creating trip", error })
    }
}

const getTrips = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const trips = await Trip.find({ members: user._id });
        // console.log("the trips are",trips)
        res.json(trips);
    }
    catch (error) {
        console.error("the error in getTrips is", error);
    }
}

const getTripMessages = async (req, res) => {
    try {
        const { tripId } = req.body;
        console.log("the trip id is", tripId)
        let messages = await Message.find({ tripId: tripId }).sort({ timestamp: 1 });
        console.log("the messages are", messages);
        res.json(messages);

    }
    catch (error) {
        console.error("the error in get messages is", error);
    }
}

module.exports = { sendFriendRequest, getFriendLocations, searchFriends, getFriends, getFriendRequests, acceptFriendRequest, createTrip, getTrips, getTripMessages }