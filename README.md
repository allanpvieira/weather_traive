# weather_traive

A Simple API that serves weather data.

The architecture is based on Mongodb and Redis.

The application expects those services to be served on ports 27017 and 6379, respectively. Make sure you have all the services under the same network.

To instantiate them as containers you can simply run:

1. docker run --net=yournetwork -itd --name mongo -p 27017:27017 mongo:4.1

2. docker run --net=yournetwork -itd --name redis -p 6379:6379 redis:4.0

3. docker run --net=yournetwork --name weather_traive -p 8080:8080 allanpvieira/weather_traive:0.2.0

4. Access route localhost:8080 for instructions on how to use the API

5. Acess route localhost:8080 /weather/minneapolis to access weather for the city of minneapolis

IMPORTANT: The API does not serve real weather information as this project is just meant to be a sample API

To create your network you can execute: docker network create --driver=bridge yournetwork

github: https://github.com/allanpvieira/weather_traive