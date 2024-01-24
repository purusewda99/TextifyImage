const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    originalName: String,
    filename: String,
    extractedText: String,
    boldWords: [String],
    base64: String,
    uploadDate: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;