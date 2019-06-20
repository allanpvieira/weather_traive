const routes = require('express').Router();
const func = require('../functions/weather');
const models = require('../models/models');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const redis = require('redis');
//Expeting to connect to redis on port 6379
const redisClient = redis.createClient({host: 'redis', port: 6379});

//Expeting to connect to Mongodb on port 27017
const url = 'mongodb://mongo:27017';
var db = null

// Preventing redis connection error from crashing the application
redisClient.on('error', (err) => {
    console.log("Error " + err);
  });

// Main route, return current weather of any given city
// First looks it up on Redis and then on Mongo afterwards
// Determines the current weather (from another function), if nothing returns
routes.get('/weather/:city', function (req, res) {
    console.log('http GET request', req.params);

    // Style city name
    var city = req.params.city.capitalize(); 

    // Tries to get current weather from redis
    models.getWeatherRedis(redisClient, city, function(err, weather)
    {
        if (err) {
            res.statusCode = 500;
            res.send(err);
        }
        else {
            if (weather) {
                res.statusCode = 200;
                res.send(JSON.parse(weather));
            }
            else {
                // Trie to get current weather from database
                models.getWeatherDb(db, city, function(error, weather){
                    if (error) {
                        res.statusCode = 500;
                        res.send(error);
                    }
                    else {
                        if (weather){
                            // Update weather in case the weather was present on the database but not redis
                            // Redis is also used to define expired weather
                            current_weather = func.getWeather(weather.celsius);
                            current_weather.city = city;

                            // Updates weather on the databse
                            models.setWeatherDb(db, city, current_weather, function(err, result)
                            {
                                if (err) {
                                    res.statusCode = 500;
                                    res.send(err);
                                }
                                else {
                                    // Updates the weather on redis, valid for 30 seconds
                                    models.setWeatherRedis(redisClient, city, current_weather);
                                    res.statusCode = 200;
                                    res.send(current_weather);
                                }
                            });
                        }
                        else {
                            // Gets weather in case it was not present on either redis or database
                            current_weather = func.getWeather();
                            current_weather.city = city;
                            
                            // Sets weather on the databse
                            models.setWeatherDb(db, city, current_weather, function(err, result)
                            {
                                if (err) {
                                    res.statusCode = 500;
                                    res.send(err);
                                }
                                else {
                                    models.setWeatherRedis(redisClient, city, current_weather);
                                    res.statusCode = 200;
                                    res.send(current_weather);
                                }
                            });                            
                        }
                    }
                });
            }
        }
    });
    
    
});

function connect(cb)
{
    // Will always try to connect uppon connection error
    console.log('Trying to connect to MongoDB...');
    MongoClient.connect(url, {useNewUrlParser: true, reconnectTries: Infinity, reconnectInterval: 1000}, function(err, client) {
        if (err) cb(err, false);
        console.log("Connected successfully to server");    
        db = client.db('weather');        

        // Create the index for lookup performance
        db.collection('city').createIndex({ city : 1 }, function(err, result) {});

        // Return true for connection status on callback function
        cb(null, true);        
    });    
    
}

module.exports = routes
module.exports.connect = connect