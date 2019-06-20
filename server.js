
"use strict";

const express = require('express')
const app = express()

// Access to the routes defined on weather.js under the "routes" folder
const routes = require('./routes/weather');

// Express will serve at port 8080
const PORT = 8080;
const HOST = '0.0.0.0';


// Criation of a convenience protopyte to deal with string capitalization
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

// Returning a message when reaching the API by "/" route
app.get('/', function(req, res){
    var message = "Welcome to the weather API, please access route \
    /weather/yourcity to have access to the current weather"

    res.statusCode = 200;
    res.send({message: message});
});

// Using routes defined above
app.use('/', routes)

//Default error message, in case the user tries to access invalid route
app.use(function(req, res){
    res.statusCode = 404;
    res.send({'message': 'route not found'});
});

// Connecting to the databases
routes.connect(function(err, res)
{
    if(err){
        console.log(err);
        return;
    }
    
    // Listening to defined PORT and HOST
    app.listen(PORT, HOST, () => console.log(`Weather traive is listening on port ${PORT}!`));
})
