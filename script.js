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
    // Private instance fields
    #map;
    #mapEvent;

    constructor() {
        this.#getPosition();

        form.addEventListener('submit', this.#newWorkout.bind(this));

        // Adding the listener to the select -> change event
        inputType.addEventListener('change', this.#toggleElevationField);
    }

    #getPosition() {
        navigator.geolocation.getCurrentPosition(this.#loadMap.bind(this), function () {
            alert(`Couldn't retreive your location ☹️☹️`);
        }, { enableHighAccuracy: true, timeout: 10000 });
    }

    #loadMap(position) {
        const { latitude, longitude } = position.coords;

        // Adding the leaflet library
        //  To set the latitude and longitude for our position..
        const coords = [latitude, longitude];
        // 13 -> zoom level
        console.log(this);
        this.#map = L.map('map').setView(coords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        // Adding the event listener to map object using on() method
        this.#map.on('click', this.#showForm.bind(this));
    }

    #showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    #toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    #newWorkout(e) {
        e.preventDefault();

        // Clearing Input fields
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

        // Display marker
        const { lat, lng } = this.#mapEvent.latlng;

        L.marker([lat, lng]).addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: 'running-popup',
            }))
            .setPopupContent('Workout!')
            .openPopup();
    }
}

const app = new App();

