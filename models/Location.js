const mongoose = require('mongoose');


const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],   
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],    
      required: true
    }
  },
  experienceType: { type: String },
  timeOfDay: { type: String },
  moodBased: { type: String },
  preference: { type: String },
  price: { type: Number },
  persons: { type: Number },
  User: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: {
    url: String,
    public_id: String
},
modeOfTransport:{ type: String },
recommendation:{type:String},
locatonType:{type:String}
});

locationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);
