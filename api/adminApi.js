// allow requests from all domains
var cors = require("cors");

// bring in data models
var Location = require("./../app/models/Location");
var Event = require("./../app/models/Event");
var User = require("./../app/models/Users");
var Client = require("./../app/models/Client.js");

// custom middleware to verify web tokens in auth process and keep a record of user's source apps
var VerifyToken = require("./../auth/verifyToken.js");

var config = require("./../config.js");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

module.exports = function(app) {

/*****  LOCATION OPERATIONS ****/    
// Save location
app.post("/api/new/location", VerifyToken, function(req, res, next) {

    // location object (req.body) looks like:  
    /* {
        "name":"Location name",
        "type":"TourStop|Sponsor",
        "map":"true|false",
        "address":"Street address",
        "description":"Info on location",
        "image":"url/to/image",
        "pos":{
            "lat":latitude,
            "lng":longitude}
        }
    */
    var location = new Location(req.body);
    location.save( function (err,doc){
      // Send any errors to the browser
      if (err) {
        res.json({
          success:false,
          message: err
        });
      }
      // Otherwise, send success and location object back
      else {
        res.json(
            // return the saved document as a complete mongo doc, so that it includes the doc._id
            {
            success: true,
            data : doc
          })
      }
    });
  });


// Retrieve all saved locations
app.get("/api/locations", VerifyToken, function(req,res,next){
    // retrieve all location docs in Mongo DB
    Location.find ({}, function(err, places){
      if(err){
        res.json(
            {
                success:false,
                message:err
            });
      }
      else{
        /* when data is present, places looks like:  [
            {
                "name":"Location name",
                "type":"TourStop|Sponsor",
                "map":"true|false",
                "address":"Street address",
                "description":"Info on location",
                "image":"url/to/image",
                "pos":{
                    "lat":latitude,
                    "lng":longitute},
                "_id":id
            },
            {
                ... next place ...
            }
        ] */
        res.json(
            {
                success:true,
                data:places
            });
      }
    });
});

// Remove location
app.get("/api/remove/location/:id", VerifyToken, function(req,res,next){
  console.log(`attempting to remove ${req.params.id}`);
  Location.remove({ _id: req.params.id }, function (err) {
    if (err) {
        res.json({
            success:false,
            message:err
        })
    }
    else {
        res.json({
            success: true,
            message:`${req.params.id} removed`,
            data: req.params.id
        })
    }
  });
});

// Update location
// replaces location matching passed in ID with the req.body object, or creates it if it doesn't exist (upsert: true); returns new location object to application
app.post("/api/update/location", VerifyToken, function(req, res, next){

    console.log(`attempting to update ${req.body.id}`);
    Location.findOneAndUpdate( {"_id":req.body.id}, req.body, {new:true, upsert: true}, function (err,doc) {
    if (err) {
        res.json({
            success:false,
            message:err
        })
    }
    else {
        res.json({
            success: true,
            message:`${req.body.id} updated`,
            data: doc
        })
    }
  });
});

/**** FRIENDS OF TOUR OPERATIONS *****/
/*** Friends of Tour scraping ***/
app.get("/api/friends/", VerifyToken, function(req,res,next){
    // load our scraping tools
    const cheerio = require("cheerio");
    const request = require("request");
    
    // pass URL retrieved from front-end request to the request module
    request(req.query.source, (error, response, html ) => {
        if (!error && response.statusCode == 200) {
        
            //all good with request? load "html" into the cheerio library as $
            const $ = cheerio.load(html);
            var friends = $(".entry-content").children("ul").children("li");
            var data=[];
            $(friends).each( (index,element)=>{
                data.push(element.children[0].data);
            });
            res.status(200).json({
                "success": true,
                "data": data
            })
        }
        else {
            console.log("Error scraping friends",error);
            res.status(500).json({
                "success": false,
                "data" : "There was an error retrieving friends data."
            })
        }
      });
          
    
}); // end Friends of tour scraping 



/**** TOUR EVENT OPERATIONS *****/
// add new event 
    app.post("/api/new/event", VerifyToken, function(req,res, next){
        var event = new Event(req.body);
        event.save( function( error, doc) {
            // Send any errors to the browser
            if (error) {
              res.json({
                success:false,
                message: error
              });
            }
            // Otherwise, send success and friend doc back
            else {
              res.json(
                  {
                  success: true,
                  data : doc
                })
            }
          });
        
    });

    // update event
    app.post("/api/update/event", VerifyToken, function(req, res, next){
        
            console.log(`attempting to update ${req.body.id}`);
            Event.findOneAndUpdate( {"_id":req.body.id}, req.body, {new:true, upsert: true}, function (err,doc) {
            if (err) {
                res.json({
                    success:false,
                    message:err
                })
            }
            else {
                res.json({
                    success: true,
                    message:`Event ${doc._id} updated`,
                    data: doc
                })
            }
          });
        });

    // Remove event
    app.get("/api/remove/event/:id", VerifyToken, function(req,res,next){
        console.log(`attempting to remove event ${req.params.id}`);

        Event.remove({ _id: req.params.id }, function (err) {
        if (err) {
            res.json({
                success:false,
                message:err
            })
        }
        else {
            res.json({
                success: true,
                message:`${req.params.id} removed`
            })
        }
        });
    });

// Retrieve all tour events
app.get("/api/events", VerifyToken, function(req,res,next){
    // retrieve all event docs in Mongo DB
    Event.find ({}, function(err, data){
      if(err){
        res.json(
            {
                success:false,
                message:err
            });
      }
      else{
        res.json(
            {
                success:true,
                data:data
            });
      }
    });
});

/**** USER OPERATIONS ****/
// generate system token
app.post("/api/token", VerifyToken, (req, res, next)=>{
    console.log(req.body);
    var clientUser = new Client(req.body);
    clientUser.save( (error,client)=>{
        console.log("ERROR",error,"CLIENT:",client);
        var token = jwt.sign({
            id : client._id
        }, config.authSecret);
        if (error) {
            if (error.code == 11000) {
              var message = "That client already exists. Try again!"
            };
            res.json({
                "success":false,
                "message": message,
                "error": error
            })
        }
        else { 
            res.json({
                "success":true,
                "client": {
                    name: client.name,
                    email: client.email,
                    id: client._id,
                    token: token
                },
                "message":`Client ${client.username} created. Keep token in a safe place.`
            })
        }
    })
}); // end generate system token route

// Save new user to mongoDB
    app.post("/api/signup", VerifyToken, function(req, res, next){
        var newUser = new User(req.body);
        newUser.save(function(error,user){
            if (error) {
                if (error.code == 11000) {
                  var message = "That username already exists. Try again!"
                };
                res.json({
                    "success":false,
                    "message": message 
                })
            }
            else { 
                res.json({
                    "success":true,
                    "user":req.body.username,
                    "message":`Welcome, ${req.body.username}`
                })
            }
        })
    }); // end signup post route

// log-in user
    app.post("/api/signin", function(req,res){
      User.findOne({'username' : req.body.username}, function (err, user) {
      if (err) console.log(err)
      else {
          if (!user) {
            res.json({
              "success":false,
              "message": "Unable to log you in. Try again!"            
              })
          }
          else if (user.authenticate(req.body.password)) {
             // log in successful; generate token and send it back to front
            var token = jwt.sign({ 
                id: user._id 
            }, config.authSecret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.json({
                "success":true,
                "token": token,
                "user":req.body.username,
                "message":`Welcome, ${req.body.username}`
              })
            } 
          else
              res.json({
                "success":false,
                "message":"Unable to log you in. Try again."})
          }
      });
    });

    // retrieve all users
    app.get("/api/users", VerifyToken, function(req,res,next){
        // retrieve all user records in Mongo DB
        User.find({})
        .select("username _id") 
        .exec( (err, users)=>{
        if(err){
            res.json(
                {
                    success:false,
                    message:err
                });
        }
        else{
            res.json(
                {
                    success:true,
                    data:users
                });
        }
        });  // end user .exec callback
    });

    // update user
    app.post("/api/update/user", VerifyToken, function(req, res, next){
    
        console.log(`attempting to update ${req.body._id}`);
        User.findOneAndUpdate( {
            "_id":req.body._id
        }, req.body, {
            new:true, 
            upsert: true
        }, (err,user)=>{
        if (err) {
            var message = err;
            if (err.code == 11000) {
                message = "That username already exists. Try again!"
            };
            res.json({
                success:false,
                message:message
            })
        }
        else {
            res.json({
                success: true,
                message:`User ${user._id} updated`,
                data: {
                    username: user.username,
                    _id: user._id
                    }
                })
            }
        });
    });

    // Remove user
    app.get("/api/remove/user/:id", VerifyToken, function(req,res,next){
        User.remove({ _id: req.params.id }, function (err) {
        if (err) {
            res.json({
                success:false,
                message:err
            })
        }
        else {
            res.json({
                success: true,
                message:`${req.params.id} removed`
            })
        }
        });
    });

};
