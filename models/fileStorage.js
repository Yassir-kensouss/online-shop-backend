const mongoose = require('mongoose');

const FileStorageSchema = new mongoose.Schema({
    file:{
        type:String,
        require: true,
    }
},{timestamps:true})

module.exports = mongoose.model('FileStorage',FileStorageSchema)