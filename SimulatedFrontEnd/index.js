
const express=require('express');
const serveStatic=require('serve-static');
const path = require("path");

var hostname="localhost";
var port=3001;


var app=express();


app.use(function(req,res,next){
    console.log(req.url);
    console.log(req.method);
    console.log(req.path);
    console.log(req.query.id);
    //Checking the incoming request type from the client
    if(req.method!="GET"){
        res.type('.html');
        var msg='<html><body>This server only serves web pages with GET request</body></html>';
        res.end(msg);
    }else{
        next();
    }
});


app.use(serveStatic(__dirname+"/public"));


app.get("/", (req, res) => {
    res.sendFile("/public/home.html", { root: __dirname });
});

// HTTPS only
const https = require('https');
const fs = require('fs');

const httpsServer = https.createServer({
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'localhost.crt')),
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'localhost.key'))
}, app);

httpsServer.listen(port, () => {
    console.log(`Server is Listening on: https://localhost:${port}/`);
});

/*
app.listen(port,hostname,function(){

    console.log(`Server hosted at http://${hostname}:${port}`);
});
*/