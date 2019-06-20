# weather_traive

A Simple API that serves weather data.


The architecture is based on Mongodb and Redis.

The application expects those services to be served on ports 27017 and 6379, respectively.


To instantiate them as containers you can simply run:

docker run -itd --name mongo -p 27017:27017 mongo:4.1

docker run -itd --name redis -p 6379:6379 redis:4.0

