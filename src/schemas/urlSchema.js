const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        unique: true,
        default: () => {
            return nanoid(10)
        }
    },
    totalClicks: {
        type: Number,
        default: 0
    }

});

module.exports = mongoose.model('Url', urlSchema);