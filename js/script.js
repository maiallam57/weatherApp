var navAnchors = Array.from(document.querySelectorAll("#navbarText a"));
var searchInput = document.querySelector("#searchInput");
var weatherCards = document.querySelector("#weatherCards");
var searchBtn = document.querySelector("#searchBtn");

var apiKey = "931452cee41145b98b2172242241007";
let defaultLocation;

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

for (let index = 0; index < navAnchors.length; index++) {
    navAnchors[index].addEventListener('click', function () {
        if (navAnchors[index].classList.contains("active")) {
            navAnchors[index].classList.remove("active")
        } else {
            navAnchors[index].classList.add("active")
        }
    })
}

async function getCurrentWeather(loc) {
    try {
        await getLocation().then(location => {
            defaultLocation = location.city
        })
        if (loc == undefined) {
            loc = defaultLocation
        }
        var response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${loc}&days=3`);
        var data = await response.json();
        console.log(data)
        displayWeather(data);
    } catch (error) {
        console.log(error)
    }
}

function displayWeather(data) {
    var forecastday = data.forecast.forecastday;
    var e = new Date(data.current.last_updated.replace(" ", "T"));

    weatherCards.innerHTML = `
    <div class="card bg-secondary-color">
        <div
            class="card-header d-flex justify-content-between bg-fade">
            <p class="m-0">${days[e.getDay()]}</p>
            <p class="m-0">${e.getDate() + monthNames[e.getMonth()]}</p>
        </div>
        <div class="card-body p-4">
            <p class="card-text">${data.location.name}</p>
            <h3 class="card-title">${data.current.temp_c}<sup>o</sup>c</h3>
            <div class="card-icon">
                <img src="${data.current.condition.icon}"
                    alt="weather icon"
                    class="w-25">
            </div>

            <div class="card-text">
                <p
                    class="d-block text-main-color my-3">${data.current.condition.text}
                </p>
                <span class="me-3">
                    <img
                        src="images/icon-umberella.png"
                        alt="icon" width="21" height="21"
                        class="me-2">20%
                </span>
                <span class="me-3">
                    <img
                        src="images/icon-wind.png"
                        alt="icon" width="21" height="21"
                        class="me-2">18km/h
                </span>
                <span class="me-3">
                    <img
                        src="images/icon-compass.png"
                        alt="icon" width="21" height="21"
                        class="me-2">East
                </span>
            </div>
        </div>
    </div>

    <div class="card bg-main-color text-center">
        <div class="card-header text-center bg-fade">
            <p class="m-0">${days[e.getDay() + 1]}</p>
        </div>

        <div class="card-body p-4">
            <div class="card-icon">
                <img src="${forecastday[1].day.condition.icon}"
                    alt="weather icon"
                    class="w-15 my-4">
            </div>
            <h4 class="card-title">${forecastday[1].day.maxtemp_c}<sup>o</sup>c</h4>
            <h6 class="card-title">${forecastday[1].day.mintemp_c}<sup>o</sup>c</h6>
            <div class="card-text">
                <p
                    class="d-block text-main-color my-4">${forecastday[1].day.condition.text}</p>
            </div>
        </div>
    </div>

    <div class="card bg-secondary-color text-center">
        <div class="card-header text-center bg-fade">
            <p class="m-0">${days[e.getDay() + 1]}</p>
        </div>

        <div class="card-body p-4">
            <div class="card-icon">
                <img src="${forecastday[2].day.condition.icon}"
                    alt="weather icon"
                    class="w-15 my-4">
            </div>
            <h4 class="card-title">${forecastday[2].day.maxtemp_c}<sup>o</sup>c</h4>
            <h6 class="card-title">${forecastday[2].day.mintemp_c}<sup>o</sup>c</h6>
            <div class="card-text">
                <p
                    class="d-block text-main-color my-4">${forecastday[2].day.condition.text}</p>
            </div>
        </div>
    </div>
    `;
}

async function success(pos) {
    const crd = pos.coords;

    try {
        let response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${crd.latitude}&lon=${crd.longitude}`);
        let responsed = await response.json();
        return {
            city: responsed.address.city,
            country: responsed.address.country
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    throw err;
}

function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async pos => {
                    try {
                        const location = await success(pos);
                        resolve(location);
                    } catch (error) {
                        reject(error);
                    }
                },
                err => error(err).then(reject),
                options
            );
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

searchInput.addEventListener('keyup', function (eventInfo) {
    getCurrentWeather(eventInfo.target.value)
})

searchBtn.addEventListener('click', function (eventInfo) {
    eventInfo.preventDefault()
    getCurrentWeather(eventInfo.target.value)
})

document.addEventListener('load', function () {
    getCurrentWeather()
})

getCurrentWeather()