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

/* The Geolocation API and the Leaflet Library */

navigator.geolocation.getCurrentPosition(function (position) {
    const { latitude, longitude } = position.coords;

    // Adding the leaflet library
    //  To set the latitude and longitude for our position..
    const coords = [latitude, longitude];
    // 13 -> zoom level
    const map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Adding the event listener to map object using on() method
    map.on('click', function (mapEvent) {
        form.classList.remove('hidden');
        inputDistance.focus();

        // const { lat, lng } = mapEvent.latlng;

        // L.marker([lat, lng]).addTo(map)
        //     .bindPopup(L.popup({
        //         maxWidth: 250,
        //         minWidth: 100,
        //         autoClose: false,
        //         closeOnClick: false,
        //         className: 'running-popup',
        //     }))
        //     .setPopupContent('Workout!')
        //     .openPopup();
    })

}, function () {
    alert(`Couldn't retreive your location ☹️☹️`);
}, { enableHighAccuracy: true, timeout: 10000 })
