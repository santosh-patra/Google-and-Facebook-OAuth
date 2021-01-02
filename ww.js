const jwt = require('njwt')
const jwt_decode = require('jwt-decode')
const claims = { name: 'santosh' , addr: 'BBSR' }
const token = jwt.create(claims, 'top-secret-phrase')
token.setExpiration(new Date().getTime() + 60*1000)
// res.send(token.compact())
console.log(token.compact())
let token_id = token.compact()
var decoded = jwt_decode(token_id);
console.log("Decoded:"+decoded.name);


