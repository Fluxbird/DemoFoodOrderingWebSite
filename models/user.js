const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    firstname:
    {
        type: String,
        required:true,
        
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    mobileno:
    {
        type: Number,
        required:true,

    }
});

module.exports = mongoose.model('User',userSchema);