

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