const express = require('express');
const app = express();
//
// const jwt = require('njwt');
// const jwtFB = require('./model/jwt_fb');
// const jwt_decode = require('jwt-decode')
//
const fs = require('fs');
const https = require('https');
var mongoose = require ('mongoose');
const {OAuth2Client} = require('google-auth-library');
var User = require('./model/user');
var FBUser = require('./model/fbDB');
require('dotenv').config()
app.use(express.json());

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})
//Google Details Store in DB
app.post('/google', function(req, res){
    let CLIENT_ID = process.env.CLIENT_ID
    const client = new OAuth2Client(CLIENT_ID);
    let verify = new Promise((resolve,reject)=>{
        client.verifyIdToken({
            idToken: req.body.token_id,
            audience: CLIENT_ID
        }).then(result=>{
            resolve(result)
        }).catch(err=>{
            reject(err)
        })
    })
    verify.then(resul=>{
        var id = req.body.id;
        let token_id = req.body.token_id;
    //mongo schema Data
        let new_user = new User({
            id: req.body.id,
            full_name: req.body.full_name,
            given_name : req.body.given_name,
            family_name: req.body.family_name,
            img_url: req.body.img_url,
            email: req.body.email,
            token_id: req.body.token_id 
        });
        User.find({"id":id}).then(result=>{
            if (result.length === 0){
                new_user.save(function(err){
                    if (err) throw err
                    console.log("New User Created")
                    })
            }
            else{
                result.forEach(element => {
                    token = element.token_id;
                    User.updateOne({id : id},{$set :{token_id : token_id}},function(err,res){
                        if (err) throw err
                        console.log("Same User Found!!!Token ID Updated")                 
                    })
                });
                }
        }).catch(err=>{
            console.log(err)    
            })
    }).catch(err=>{
        console.log(" Token MisMatched..")
        // console.log(err)
    })
    res.json({"status":"okay"})
});
//FB Deatils Store in DB
app.post('/fbData',function(req, res){
    var id = req.body.id;
    var token_id = req.body.token_id;
    var name = req.body.name;
    // var link = `https://graph.facebook.com/${id}?fields=id,name&access_token=${token_id}`;
    var link = `https://graph.facebook.com/me?&access_token=${token_id}`;
    var request = https.get(link, function (response) {
        // console.log(response)
        let resp = response.statusCode;
        if (resp === 200){
            var newFbUser = new FBUser({
                id: id,
                name: name,
                token_id: token_id
            })
            FBUser.find({"id":id}).then(result=>{
                if (result.length === 0){
                    newFbUser.save(function(err){
                        if (err) throw err
                        console.log("Success")
                    })
                }
                else{
                    result.forEach(element => {
                    FBUser.update({"id":id},{$set: {token_id: token_id}},function(err, res){
                        if (err) throw err
                        console.log("Fb token Update Successful")
                    })       
                    });
                }
            })       
        }
        else{
            console.log("Failed To Connect!!!")
        }
    });
        
    res.json({"status":"OK"});
})
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};
//
const httpsServer = https.createServer(options, app); 
mongoose.connect('mongodb://localhost:27017/OAuthDB').then(result=>{
    httpsServer.listen(3000);
    console.log("Started")
})
.catch(err=>{
    console.log(err);
});