const  key = "4Y8D2KHGPB9M3YNDYKU62Y5PT";
const form = document.querySelector("form");
const country = document.getElementById("country");
const countryError = document.querySelector("#country + span.error");
let actualTempUse = true; //True == celsius, false == farenheit


async function getData(url) {
    try {
        const firstResult = await fetch(url, { mode: 'cors' });
        const result = await firstResult.json(); 
        return processData(result); 
    } catch(e) {
        console.log(e);
    }   
}

function processData(rawData) {
    let result = [];
    const amountDays = 4;
    const availableDays = Math.min(amountDays, rawData.days.length);
    for (let i = 0; i < availableDays; i++) {
        const weatherData = {
            currentConditions: rawData.days[i].conditions,
            datetime: rawData.days[i].datetime,
            humidity: rawData.days[i].humidity,
            icon: rawData.days[i].icon,
            precip: rawData.days[i].precip,
            snow: rawData.days[i].snow,
            temp: rawData.days[i].temp,
        };
        result.push(weatherData);
    }
    return result;
}

function createWeatherApp(data, temp) {
    const container = document.createElement('div');
    container.classList.add('container');

    // First Container
    const firstContainer = document.createElement('div');
    firstContainer.classList.add('first-container');

    const weatherInfo = document.createElement('div');
    weatherInfo.classList.add('weather-info');

    const weatherIcon = document.createElement('img');
    weatherIcon.src = `./images/${data[0].icon}.png`;

    const weatherText = document.createElement('div');
    weatherText.classList.add('weather-text');

    const temperature = document.createElement('h3');

    if(temp){
        temperature.textContent = data[0].temp;
    }else{
        temperature.textContent = celsiusToFahrenheit(data[0].temp);
    }
    

    const temperatureButtons = document.createElement('div');
    temperatureButtons.classList.add('temperature-buttons');

    const buttonC = document.createElement('button');
    buttonC.textContent = 'C°';
    buttonC.addEventListener('click', function(){
        if(!actualTempUse){
            actualTempUse = true;
            let newContainer = createWeatherApp(data, actualTempUse);
            let oldContainer = document.querySelector('.container');
            oldContainer.parentNode.replaceChild(newContainer, oldContainer);
        }
    });

    const buttonF = document.createElement('button');
    buttonF.textContent = 'F°';
    buttonF.addEventListener('click', function(){
        if(actualTempUse){
            actualTempUse = false;
            let newContainer = createWeatherApp(data, actualTempUse);
            let oldContainer = document.querySelector('.container');
            oldContainer.parentNode.replaceChild(newContainer, oldContainer);
        }
    });

    temperatureButtons.appendChild(buttonC);
    temperatureButtons.appendChild(buttonF);

    weatherText.appendChild(temperature);
    weatherText.appendChild(temperatureButtons);

    weatherInfo.appendChild(weatherIcon);
    weatherInfo.appendChild(weatherText);

    const weatherDetails = document.createElement('div');
    weatherDetails.classList.add('weather-details');

    const clima = document.createElement('h3');
    clima.textContent = 'Clima';

    const day = document.createElement('h3');
    const dateString = data[0].datetime;
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    day.textContent = dayName;

    const condition = document.createElement('h3');
    condition.textContent = data[0].currentConditions;

    weatherDetails.appendChild(clima);
    weatherDetails.appendChild(day);
    weatherDetails.appendChild(condition);

    firstContainer.appendChild(weatherInfo);
    firstContainer.appendChild(weatherDetails);

    // Second Container
    const secondContainer = document.createElement('div');
    secondContainer.classList.add('second-container');

    const rain = document.createElement('p');
    rain.textContent = `Rain probability: ${data[0].precip}`;

    const snow = document.createElement('p');
    snow.textContent = `Snow probability: ${data[0].snow}`;

    const humidity = document.createElement('p');
    humidity.textContent = `Humidity: ${data[0].humidity}`;

    secondContainer.appendChild(rain);
    secondContainer.appendChild(snow);
    secondContainer.appendChild(humidity);

    // Other Days Container
    const otherDaysContainer = document.createElement('div');
    otherDaysContainer.classList.add('otherdays-container');

    for (let i = 0; i < 4; i++) {
        const otherDayCard = document.createElement('div');
        otherDayCard.classList.add('otherday-card');

        const day = document.createElement('p');
        const dateString = data[i].datetime;
        const date = new Date(dateString);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        day.textContent = dayName;

        const icon = document.createElement('img');
        icon.src = `./images/${data[i].icon}.png`;

        const tempTag = document.createElement('div');
        if(temp){
            tempTag.textContent = `${data[i].temp}°`;
        }else{
            tempTag.textContent = `${celsiusToFahrenheit(data[i].temp)}°`;
        }
        

        otherDayCard.appendChild(day);
        otherDayCard.appendChild(icon);
        otherDayCard.appendChild(tempTag);

        otherDaysContainer.appendChild(otherDayCard);
    }

    // Append all containers to the main container
    container.appendChild(firstContainer);
    container.appendChild(secondContainer);
    container.appendChild(otherDaysContainer);

    // Append the container to the DOM
    return container;
}

function celsiusToFahrenheit(celsius) {
    return ((celsius * 9/5) + 32).toFixed(0);
}

document.addEventListener('DOMContentLoaded', async function() {
    let loc = "New York";
    const u = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=metric&key=${key}&contentType=json`;
    try{
        let result = await getData(u);
        let newContainer = createWeatherApp(result, actualTempUse);
        document.body.appendChild(newContainer);
    }catch(e){
        console.log("Location do not exist");
    }

    const searchForm = document.getElementById('search-form');
    const searchIcon = document.getElementById('search-icon');
    const searchInput = document.getElementById('location');

    searchIcon.classList.add('clicked');
    setTimeout(() => searchIcon.classList.remove('clicked'), 150);

     searchIcon.addEventListener('click', async function() {
        const location = searchInput.value.trim();
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${key}&contentType=json`;
        try{
            let result = await getData(url);
            let newContainer = createWeatherApp(result, actualTempUse);
            let oldContainer = document.querySelector('.container');
            oldContainer.parentNode.replaceChild(newContainer, oldContainer);
        }catch(e){
            console.log("Location do not exist");
        }
     });
   

});



