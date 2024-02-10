'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// variable definition
let map, mapEvent;

// Using the OOP architecture to set the code....

class App {
    constructor() {
        this.#getPosition();
    }

    #getPosition() {
        navigator.geolocation.getCurrentPosition(this.#loadMap, function () {
            alert(`Couldn't retreive your location ☹️☹️`);
        }, { enableHighAccuracy: true, timeout: 10000 });
    }

    #loadMap(position) {
        const { latitude, longitude } = position.coords;

        // Adding the leaflet library
        //  To set the latitude and longitude for our position..
        const coords = [latitude, longitude];
        // 13 -> zoom level
        map = L.map('map').setView(coords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Adding the event listener to map object using on() method
        map.on('click', function (mapE) {
            mapEvent = mapE;
            form.classList.remove('hidden');
            inputDistance.focus();
        })
    }

    #showForm() {

    }

    #toggleElevationField() {

    }

    #newWorkout() {

    }
}

const app = new App();

// EVENT LISTENER FOR FORM
form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Clearing Input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

    // Display marker
    const { lat, lng } = mapEvent.latlng;

    L.marker([lat, lng]).addTo(map)
        .bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: 'running-popup',
        }))
        .setPopupContent('Workout!')
        .openPopup();
});

// Adding the listener to the select -> change event
inputType.addEventListener('change', function () {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
})
