const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  room: { type: String, required: true, index: true },
  email: { 
    type: String, 
    required: true,
    validate: {
      validator: (v) => /\S+@\S+\.\S+/.test(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
