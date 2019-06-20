// Function to generate weather between -10 and 45 degrees celsius
// If a privious value is given, generates another which differece doesn't 
// go over 3 degrees (the idea is to simulate subtle temperature variation)

function getWeather(previous)
{
    let min = -10;
    let max = 45;

    let x = Math.random()

    if (previous){
        min = -3;
        max = 3;

        let cel = previous + min + (max-min)*x;
        let far = (cel*9/5) + 32;

        return {'celsius': cel, 'farenheint': far}
    }
    
    let cel = min + (max-min)*x
    let far = (cel*9/5) + 32
    
    return {'celsius': cel, 'farenheint': far}
}


module.exports.getWeather = getWeather;