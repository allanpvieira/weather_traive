const routes = require('express').Router()
const func = require('../functions/weather');
const models = require('../models/models')
const MongoClient = require('mongodb').MongoClient;
const redis = require('redis');
const redisClient = redis.createClient({port: 8081});

redisClient.on('error', (err) => {
    console.log("Error " + err);
  });

const url = 'mongodb://localhost:27017';
var db = null

routes.get('/weather/:city', function (req, res) {
    var city = req.params.city.capitalize(); //TODO: split by _ and ask to please ignore special characters    

    models.getWeatherRedis(redisClient, city, function(err, weather)
    {
        if (err) res.send(err);
        else {
            if (weather) res.send(JSON.parse(weather));
            else {
                models.getWeatherDb(db, city, function(error, weather){
                    if (error) res.send(error);
                    else {
                        if (weather){
                            current_weather = func.getWeather(weather.celsius);
                            current_weather.city = city;
                            models.setWeatherDb(db, city, current_weather, function(err, result)
                            {
                                if (err) res.send(err);
                                else {
                                    redisClient.setex(city, 30, JSON.stringify(current_weather));
                                    res.send(current_weather);
                                }
                            });
                        }
                        else {
                            current_weather = func.getWeather();
                            current_weather.city = city;
                            db.collection('city').insertOne(JSON.parse(JSON.stringify(current_weather)));
                            redisClient.setex(city, 30, JSON.stringify(current_weather));
                            res.send(current_weather);
                        }
                    }
                });
            }
        }
    });
    
    
});

function connect(cb)
{
    MongoClient.connect(url, {useNewUrlParser: true, reconnectTries: Infinity, reconnectInterval: 1000}, function(err, client) {
        if (err) cb(err, false);
        console.log("Connected successfully to server");    
        db = client.db('weather');        

        // Create the index
        db.collection('city').createIndex({ city : 1 }, function(err, result) {});

        cb(null, true);        
    });    
}

module.exports = routes
module.exports.connect = connect