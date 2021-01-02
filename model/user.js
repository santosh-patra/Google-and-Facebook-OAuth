var mongoose = require('mongoose');
var Schema = mongoose.Schema();
var userSchema = new mongoose.Schema({
    id : Number,
    full_name: String,
    given_name: String,
    family_name: String,
    img_url: String,
    email: String,
    token_id: String
});

var user = mongoose.model('user',userSchema);
module.exports = user;