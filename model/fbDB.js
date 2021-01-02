var mongoose = require('mongoose');
var Schema = mongoose.Schema();
var fbuserSchema = new mongoose.Schema({
    id : Number,
    name: String,
    token_id: String
});

var fbuser = mongoose.model('fb_user',fbuserSchema);
module.exports = fbuser;