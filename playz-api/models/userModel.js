const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    likedMovies: Array
});

const User = mongoose.model('User', userSchema);

module.exports = User;