const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique:true
    },
    email:{
        type: String,
        required: true
    },
    mobile:{
        type: Number,
        required: true
    }

})

const userModel=new mongoose.model("users",userSchema);

module.exports=userModel;