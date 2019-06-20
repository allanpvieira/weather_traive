
"use strict";

const express = require('express')
const app = express()

const redis = require('redis');
const routes = require('./routes/weather');

const PORT = 8080;
const HOST = '0.0.0.0';


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

app.get('/', function(req, res){
    var message = "Welcome to the weather API, please access route \
    /weather/yourcity to have access to the current weather"

    res.send(message)
});


app.use('/', routes)

//Default error message, in case the user tries to access invalid route
app.use(function(req, res){
    res.send({'message': 'route not found'});
});

routes.connect(function(err, res)
{
    if(err){
        console.log(err);
        return;
    }
    
    app.listen(PORT, HOST, () => console.log(`Example app listening on port ${PORT}!`));
})
