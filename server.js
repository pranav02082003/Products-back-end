const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const cors = require('cors');
const app = express()
const jwt = require('jsonwebtoken');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())


const uri = process.env.URL;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


app.get("/", function (req, res) {
    res.send("Hello")
    console.log(req.body);
})


app.post("/Login", async (req, res) => {
    const { email, password } = req.body
    const collection = client.db("Users").collection("UserAccs")
    const loginData = await collection.find({ "email": email }).toArray()
    if (loginData[0].email === email) {
        if (loginData[0].password === password) {
            let token = jwt.sign(email, "myToken")
            res.send({ token: token })
        }
        else {
            console.log("Incorrect password");
        }

    }
    else {
        console.log("Incorrect email");
    }
})


app.post("/SignUp", async (req, res) => {

    try {
        const { name, email, password } = req.body
        console.log(req.body);
        const collection = client.db("Users").collection("UserAccs");
        const filterData = await collection.find({ "email": email }).toArray()
        let response = {
            status:"",
            message:""
        }
        if (filterData.length>0) {
            response = {
                status:"error",
                message:"Email alredy exist "
            }
            // res.send("User Already exist")
        }
        else {
            const loginData = await collection.insertOne(
                {
                    name: name,
                    email: email,
                    password: password
                }
            )
            response = {
                status:"success",
                message:"Account Registered"
            }
            // res.send("hi")
        }
        res.send(response)
        
    }
    catch(error) {
        console.log(error);
    }
})



app.listen(4000, function () {
    console.log("Server is running on port 4000");
})

