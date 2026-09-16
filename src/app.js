
    const express = require('express')
    const app = express()

    const port = process.env.PORT || 3000

    
    const path = require ("path")
    const publicDirectory =  path.join(__dirname , '../public')
    app.use (express.static (publicDirectory))


const geocode = require('./just-folder/geocode')
const forecast = require('./just-folder/forecastFile')

app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error:'You must provide address'
        })
    }
    geocode(req.query.address,(error,geoData)=>{
        if(error){
            return res.send({error})
        }
        forecast(geoData.latitude,geoData.longitude,(error,forecastData)=>{
            if(error){
                return res.send({error})
            }
            const itIndex = forecastData.indexOf(' It');
            let locationName = forecastData.slice(0, itIndex !== -1 ? itIndex : forecastData.length).trim();
            locationName = locationName.replace(/,\s*$/, '');
            const match = forecastData.match(/It is (.+?) and temp is ([0-9.-]+)/);
            const condition = match ? match[1] : '';
            const temperature = match ? parseFloat(match[2]) : null;
            res.send({
                latitude: geoData.latitude,
                longitude: geoData.longitude,
                location: locationName,
                condition: condition,
                temperature: temperature,
                raw: forecastData
            });
        })
    })
})


    app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    })
    



