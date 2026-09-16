
let form = document.getElementById('form1')
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    weatherFun()
    form.reset()
})
const errorF = document.getElementById('error')
const latitudeF = document.getElementById('latitude')
const longitudeF = document.getElementById('longitude')
const countryF = document.getElementById('country')
const conditionF = document.getElementById('condition')
const temperatureF = document.getElementById('temperature')

let weatherFun = async() =>{
    try{
        const address = document.getElementById('address').value
        const res = await fetch('http://localhost:3000/weather?address='+address)
        const data = await res.json()
        console.log(data)
        if(data.error){
            errorF.innerText = data.error
            clearResults()
        }
        else {
            errorF.innerText = ''
            latitudeF.innerText = `Latitude: ${data.latitude}`
            longitudeF.innerText = `Longitude: ${data.longitude}`
            countryF.innerText = `Country: ${data.location}`
            conditionF.innerText = `Condition: ${data.condition}`
            temperatureF.innerText = `Temperature: ${data.temperature}°C`
        }
    }
    catch(e){
        console.log(e)
        errorF.innerText = 'Something went wrong'
        clearResults()
    }
}

function clearResults(){
    latitudeF.innerText = ''
    longitudeF.innerText = ''
    countryF.innerText = ''
    conditionF.innerText = ''
    temperatureF.innerText = ''
}