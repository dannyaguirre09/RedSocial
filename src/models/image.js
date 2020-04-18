const mongoose = require('mongoose');
const { Schema } = mongoose;
const path = require('path');

const ImageScheme = new Schema({
    title: {type: String},
    description: {type: String},
    filename: {type: String},
    views: {type: Number, default: 0},
    likes: {type: Number, default: 0},
    timestamp: {type: Date, default: Date.now},
});

ImageScheme.virtual('uniqueId')
    .get(function(){
        return this.filename.replace(path.extname(this.filename), '');
    });

module.exports = mongoose.model('Image', ImageScheme);