// allow requests from all domains
var cors = require("cors");

// do we need user?
//var User = require("../app/models/user.js");
var Location = require("../app/models/Location.js");
var FriendofTour = require("../app/models/FriendofTour.js");

module.exports = function(app) {

/*****  LOCATION OPERATIONS ****/    
// Save location
app.post("/api/new/location", function(req, res) {

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
            "lng":longitute}
        }
    */
    Location.save(
      req.body,
      function( error, doc) {
      // Send any errors to the browser
      if (error) {
        res.json({
          success:false,
          message: error
        });
      }
      // Otherwise, send success and location object back
      else {
        res.json(
            // return the saved document as a complete mongo doc, so that it includes the doc._id
            {
            success: true,
            savedLocation : doc
          })
      }
    });
  });


// Retrieve all saved locations
app.get("/api/locations", function(req,res){
    // retrieve all location docs in Mongo DB
    Locations.find ({}, function(err, places){
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
app.get("/api/remove/location/:id", function(req,res){

  console.log(`attempting to remove ${req.params.id}`);

  Location.remove({ __id: req.params.id }, function (err) {
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

// Update location
// replaces location matching passed in ID with the req.body object, or creates it if it doesn't exist (upsert: true); returns new location object to application
app.post("/api/update/location/:id", function(req,res){

  console.log(`attempting to update ${req.params.id}`);

  Location.findOneAndUpdate({ __id: req.params.id }, req.body, {new:true, upsert: true}, function (err,updated) {
    if (err) {
        res.json({
            success:false,
            message:err
        })
    }
    else {
        res.json({
            success: true,
            message:`${req.params.id} updated`,
            location: updated
        })
    }
  });
});

/**** FRIENDS OF TOUR OPERATIIONS *****/
// add new friend of tour
    app.get("/api/new/friend", function(req,res){
        FriendsofTour.save(
            req.body,
            function( error, doc) {
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
                  savedFriend : doc
                })
            }
          });
        
    });

    // Remove friend of tour
    app.get("/api/remove/friend/:id", function(req,res){
        console.log(`attempting to remove friend ${req.params.id}`);

        FriendsofTour.remove({ __id: req.params.id }, function (err) {
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

// Retrieve all friends of tour
app.get("/api/friendsoftour", function(req,res){
    // retrieve all friendsoftour docs in Mongo DB
    FriendsofTour.find ({}, function(err, friends){
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
                data:friends
            });
      }
    });
});

/**** USER OPERATIONS ****/

// Save new user to mongoDB
    app.post("/api/signup", function(req, res){
        console.log("sign up route hit");
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
                console.log("Success",user.username);
                res.json({
                    "success":true,
                    "user":req.body.username,
                    "message":`Welcome, ${req.body.username}`
                })
            }
        })
    }); // end signup post route

// log-in user
    app.post("/api/signin",function(req,res){
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
              res.json({
                "success":true,
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
};
