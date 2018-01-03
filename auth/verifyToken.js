// auth modules
var jwt = require("jsonwebtoken");
var config = require("./../config.js");
   
verifyToken = (req, res,  next)=>{
    var token = req.headers["x-access-token"];
    if ( !token || token==="undefined") {
        res.status(401).json({
            auth: false,
            data : "No token provided"
        }) // end "no token provided" response
    }
    // if token is present, pass it to jwt (jsonwebtoken) module for decoding
    else {
        jwt.verify( token, config.authSecret, (err, decoded)=>{
            if (err) {
                res.status(500).json({
                    auth: false,
                    data: "Failed to authenticate token."
                }) // end error response for user id decoding
            }
            // token is verified; save ID and admin status to req for use in other routes
            else {
                console.log("decoded:",decoded);
                req.userId = decoded.id;
                // send flow to next() function
                next();
            } // end user authenticated by token resolver
        }) // end jwt.verify method
    }
}; // end verifyToken function

module.exports = verifyToken;

