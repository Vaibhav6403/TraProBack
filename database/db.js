const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


const connectdb = async () => {
    try{
    await mongoose.connect(process.env.MONGO_URI,{
    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
    }
    catch(error){
        console.error(e);
        process.exit(1);
    }

}

module.exports = connectdb;