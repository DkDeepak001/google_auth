const passport = require("passport");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const mongoose = require("mongoose");
const e = require("express");

mongoose.connect("mongodb://172.23.242.196:27017/Google_auth");

const UserSchema = new mongoose.Schema({
    googleId:String,
    email:String
})

const User = new mongoose.model("google_login_DB", UserSchema);
 


passport.use(new GoogleStrategy({
    clientID:"309824718775-8nae8m3lqfj8t0s98ejv8r88btojjo7m.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback   : true
  },
  function(req, res, accessToken, refreshToken, profile, done) {
    User.findOne({ googleId: profile.id }, (err,user) =>{

        if(err){
            console.log(err);
        }else{
            if(user){
                return done(err,profile);
            }else{
                const newGoogleUser = new User({
                    googleId:profile.id,
                    email:profile.email
                });
    
                newGoogleUser.save((error,sucess)=>{
                    if(error){
                        console.log(error)
                    }else{
                        if(sucess){
                            return done(err,profile);
                        }
                    }
                })
            }
        }
            
       
      
    });
  }
));
passport.serializeUser((user,done) => {
    done(null,user)
});

passport.deserializeUser((user,done) => {
    done(null,user)
});