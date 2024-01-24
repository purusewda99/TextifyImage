const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Password hash middleware
userSchema.pre('save', function(next) {
    if(!this.isModified('password'))    return next();

    bcrypt.hash(this.password, 10, (err, hash) => {
        if(err) return next(err);
        this.password = hash;
        next();
    });
});

// Helper method for validating user's password
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;