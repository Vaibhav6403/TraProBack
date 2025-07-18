const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstname:{type:String,required:true},
  lastname:{type:String,required:true},
  email:{type:String,required:true},
  password: { type: String, required: true },
   role: {
    type: String,
    enum: ['user', 'admin'],  
    default: 'user'           
  },
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
},{ timestamps: true });

module.exports = mongoose.model('User', userSchema);
