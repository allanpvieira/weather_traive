
function getWeatherDb(db, city, cb)
{
    db.collection('city').find({city: city},{projection:{_id: 0}}).limit(1).toArray(function(err, docs) {
        if(err){
            cb(err, null);
            return;
        }
    
        if(docs.length>0){
            weather = docs[0];
            cb(null, weather);
        }
        else{
            cb(null, null);    
        }
    });
}

function setWeatherDb(db, city, weather, cb)
{
    //db.city.update({city: 'Thays'},{$set:{celsius: 13}}, {'upsert':true})
    db.collection('city').updateOne({city: city},{$set: weather}, {'upsert':true}, function(err, res)
    {
        if (err) cb(err, null);
        else cb(null, res);
    });
}

function getWeatherRedis(redisClient, city, cb)
{
    redisClient.get(city, function(err, res)
    {
        if(err) {
            cb(err, null);
            return;
        }
        cb(null, res);
    });    
}

module.exports.getWeatherDb = getWeatherDb
module.exports.setWeatherDb = setWeatherDb
module.exports.getWeatherRedis = getWeatherRedis