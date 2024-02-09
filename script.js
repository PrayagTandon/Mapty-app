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

// The geolocation API
navigator.geolocation.getCurrentPosition(function (position) {
    const { latitude, longitude } = position.coords;
    console.log(latitude);
    console.log(longitude);

    console.log(`https://www.google.com/maps/@${latitude},${longitude},15z?entry=ttu`);
}, function () {
    alert(`Couldn't retreive your location ☹️☹️`);
}, { enableHighAccuracy: true, timeout: 10000 })
