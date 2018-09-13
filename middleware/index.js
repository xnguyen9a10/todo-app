const middlewareObj = {};
const Todo = require("../models/todo.js");
const User = require("../models/User.js");

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

module.exports = middlewareObj;