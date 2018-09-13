const mongoose = require("mongoose");
const todoSchema = mongoose.Schema({
    description:String,
    isDone:Boolean,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    }
});

module.exports = mongoose.model("Todo",todoSchema);