const express = require("express"); 
const router = express();
const mongoose = require("mongoose");
const Todo = require("../models/todo.js");
var middleware = require("../middleware/index.js")
router.get("/",function(req,res){
    res.redirect("/login");
});
router.get("/homepage",middleware.isLoggedIn,function(req,res){
    Todo.find({'isDone':false},function(error,data){
        if(error){
            console.log(error);
        } else {
           Todo.find({'isDone':true},function(err,Donedata){
               if(err){
                   console.log(err);
               } else {
                   res.render('homepage.ejs',{DoneTodo:Donedata,Todo:data,currentUser:req.user});
               }
           })};
        });
})
router.post("/todos",function(req,res){
     const author = {
        id:req.user._id
    }
    const newTodo = {
        description : req.body.description,
        isDone : false,
        author: author  
    };
    
    Todo.create(newTodo,function(err,newData){
        if(err){
            console.log(err);
        } else {
            console.log(newData);
        }
    })
    res.redirect("/homepage");
});
router.post("/todos/:id/done",function(req,res){
    Todo.findById(req.params.id,function(err,foundData){
        if(err){
            console.log(err);
        } else {
            foundData.isDone = !foundData.isDone;
            foundData.save();
            res.redirect("/homepage");
        }
    })
})
router.delete("/todos/:id/delete",function(req,res){
    Todo.findByIdAndDelete(req.params.id,function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/homepage");
        }
    })
})
module.exports = router;