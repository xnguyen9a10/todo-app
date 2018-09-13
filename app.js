const express = require("express"); 
const app = express();
const bodyParser = require("body-parser");
const mongoose = require ("mongoose");
const todoRoutes = require("./routes/todo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require('./models/User');
const methodOverride = require("method-override");
const flash = require("connect-flash");
//==============================

app.use(methodOverride("_method"));
app.use(require("express-session")(
{
    secret:"Secret things",
    resave:false,   
    saveUninitialized:false
}));    
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
//==============================
mongoose.connect('mongodb://localhost:27017/to-do-list',{ useNewUrlParser: true });
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}))
app.use(todoRoutes);
// REGISTER ROUTES
app.get("/register",function(req,res){

    res.render("register");
})
app.post("/register",function(req,res){
    const newUser = new User({
        username: req.body.username
    });
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success"," Welcome to To-do! " + req.body.username);
            res.redirect("/homepage");
        })
    });
});
//LOGIN ROUTES
app.get("/login",function(req,res){
    if(req.user==undefined){
        res.render("login");
    }
    else {
    res.redirect("/homepage");
    }
   
});
app.post("/login",passport.authenticate("local",{
    successRedirect:"/homepage",
    failureRedirect:"/login",
    successFlash:" Welcome back !",
    failureFlash:" Username or Password was wrong!"
    }) ,function(req,res){ 
});
app.get("/logout",function(req,res){
   req.logout();
   req.flash("error","Logged you out");
   res.redirect("/login");
});
//===============
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Running ...");
});