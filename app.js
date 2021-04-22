const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const request = require('request');
const url = require('url'); 
const { query } = require('express');

mongoose.connect('mongodb+srv://asheshpathak:asheshpathak@vectorcluster.lnwgc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')


const app = express()
app.use(express.static("public"))


//SCHEMA
var arduinoSchema = mongoose.Schema(
    {
        heartbeat: Number,
        temperature: Number
    });


    //var Form = mongoose.model("Form", arduinoSchema);


    var appUser = mongoose.Schema(
        {
            empId: Number,
            diseases: String,
            vitals:[arduinoSchema]
        });
    
    
        var User = mongoose.model("User", appUser);


//USAGE

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())
app.set("view engine", "ejs")


app.get('/',(req,res)=>
{
    res.render("index")
})

app.post('/api/twomenu/response',(req,res)=>{

    var params = req.body

    console.log("route hit")
    console.log(req.body)
    res.redirect("dashboard")
})


app.post('/api/arduino/request',(req,res)=>{
    console.log(req.body)
    var responseText = {heartbeat:req.body.heartbeat,temperature:req.body.temperature}

    Form.create(responseText,function(err,msg)
    {
        if(err){
            res.send("Error Occured")
        }
        else{
            res.send("Values Successfully Recorded!");
        }
    })
})


app.get('/register',(req,res)=>{
    res.render('predashboard')
})

// app.get('/dashboard',(req,res)=>{
//     res.render('dashboard')
// })

app.post('/dashboard',(req,res)=>{
    

    var diseases = req.body
    var disease = new Array();
    //console.log(diseases)

    var keys = Object.keys(diseases)
    var values = Object.values(diseases)
    var len = keys.length-1

    // console.log(keys.length)
    // console.log(values.toString())

    for(i=0;i<len;i++)
    {
        disease[i] = values[i+1]
    }

    console.log(disease)

    //User.create()
    

    res.redirect(url.format({
        pathname:"/dashboard",
        query: {
           "a": req.body.empID,
           "diseases":disease
         }
      }));

})

app.get('/dashboard',(req,res)=>{
    //console.log(req.query.diseases[2])
    res.render('dashboard',{query:req.query})
})




app.get('/api/get/livedata/',(req,res)=>{

    // var random = Math.random()
    // res.send(random)
    
        Form.findOne().sort({ date: -1 }).limit(1).exec((err, data) => {
            if(err) {
                //callback(new Error('Error querying SmallHistory (getLatestRound())'));
                res.send("Error fetching the data")
            }
            if(data) {
                //callback(null, data);
                console.log(data)
                //res.send(random)
            }
        });
    
})


app.get('/test',(req,res)=>{
    res.render('test.ejs')
})

app.get('/new',(req,res)=>{
    res.render('new.ejs')
})

// app.listen(4000,()=>{
//     console.log("Listening on PORT 4000")
// })

var port = process.env.PORT || 3000;
app.listen(port)