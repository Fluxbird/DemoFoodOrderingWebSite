const express = require("express")
const app = express()
const mongoose = require("mongoose")

var bodyParser = require('body-parser');
const { collection } = require("./models/user");
// const variablemodel=require('./signupschema');
var urlencodedParser = bodyParser.urlencoded({extended:true})

const url ="mongodb://127.0.0.1:27017/MYSIGNUPFORM"


mongoose.connect(url,{useNewUrlParser:true},
    {useUnifiedTopology:true}).then(()=>{
        console.log("MongoDB connected")
    });

var db = mongoose.connection;

app.get('/',function(req,res){
    res.sendFile(__dirname + "/" + "signupform.html");
});

// const mongoose=require('mongoose');

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

app.post('/hello',async(req,res)=>{

    const result=new userModel({
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
    });


    db.collection('users').insertOne(result,
        (err)=>{
            if(err){
                throw err;
            }
            console.log("Record inserted successfully");
        });

        var query={name:{
            $regex: /^a/}};

        var reply=await db.collection('users').find(query);

        res.send("<br> DATA saved in DATABASE<br>" + JSON.stringify(reply))
});

var server = app.listen(5000,function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Server is running")
})