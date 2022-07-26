const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./auth");

const app = express();
app.use(session({
    secret:"asdaseyhqo21837jioyI@#*(YHE@(*Y#(!2",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());


async function isLoggedIn(req,res,next){
    req.user ? next(): res.sendStatus(401);
}


app.get("/",(req,res) => {
    res.send('<a href="/auth/google">Sigin with google</a>');
})

app.get("/protected", isLoggedIn ,(req,res) => {
    res.send("protected route");
    console.log(req)
})
app.get("/auth/google",
    passport.authenticate('google', { scope : ['email' ,'profile']})
)
app.get("/google/callback",passport.authenticate("google",{
    successRedirect:"/protected",
    failureRedirect:'/auth/failure',
} ))

app.get("/auth/failure",(req,res) =>{
    res.send("something went wrong");
})

app.get("/home", isLoggedIn , (req,res) => {
    res.send(`hello ${req.user.displayName} <br> <a href="/logout"> Logout</a>`)
})

app.get("/logout",(req,res) => {
    
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });    
})
app.listen("3000",() => {
    console.log("server listing on port 3000");
})