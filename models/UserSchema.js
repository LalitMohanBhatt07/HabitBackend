const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  habits: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit', 
    },
  ],
}, );

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
