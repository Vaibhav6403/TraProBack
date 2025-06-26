const mongoose = require('mongoose');

const Group = mongoose.Schema({
    name:{type:String,require:true,unique:true},
    members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
            }]
})

module.exports = mongoose.model('group',Group);