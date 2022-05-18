require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const md5 = require('md5');
const cookie = require('cookie-parser');

var list = [];

const app = express();
mongoose.connect('mongodb+srv://kumi:kumi@cluster0.qze8u.mongodb.net/Users?retryWrites=true&w=majority',(err)=>{
    if(err)
    console.log(err);
    else
    console.log('connected');
});

var email;
var pass;
var z="";

const schema = new mongoose.Schema({
    emailid:String,
    password:String
    }
  );

 
 
  const person = mongoose.model('person', schema);

app.set('view engine','ejs');
app.use(parser.urlencoded({ extended: false }))
app.use(cookie())

app.get('/',(req,res)=>{
    res.cookie('isLoggedIn','False');
    res.cookie('email','');
    res.render('Login',{text:''});
})
app.get('/signup',(req,res)=>{
    res.render('Signup');
})
app.post('/signup',(req,res)=>{
    email=String(req.body.email);
    pass=String(req.body.password);
    var x = new person({
        emailid:email,
        password:md5(pass)
    })
    x.save();
    res.render('Login',{text:'Sign Up successfull !'});

})

app.post('/login',(req,res)=>{
    
    person.findOne({emailid:String(req.body.email)},(err,response)=>{

        if(err)
       {
        res.render('Login',{text:'Login Unsuccessful !'});
       }
        else
        {
            if(response.password===md5(req.body.password))
                {
                    
                    res.cookie('isLoggedIn','True');
                    res.cookie('email',req.body.email);
                    res.render('welcome',{emailx:req.body.email,list:list});
                }
            else
            res.render('Login',{text:'Login Unsuccessful !'});
        }

    })

    
})

app.get('/logout',(req,res)=>{
    res.cookie('isLoggedIn','False');
    res.cookie('email','');
    res.render('Login',{text:''})
    list=[];
})

app.post('/todo',(req,res)=>{
        list.push(req.body.text);
        res.render('welcome',{emailx:req.cookies.email,list:list})
})



app.listen(process.env.PORT || 3000);
