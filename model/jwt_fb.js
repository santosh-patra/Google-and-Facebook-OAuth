var mongoose = require('mongoose');
var Schema = mongoose.Schema();
var fbjwtSchema = new mongoose.Schema({
    id: Number,
    jwt_token : String
    
});

var fbJwt = mongoose.model('jwtFbToken',fbjwtSchema);
module.exports = fbJwt;