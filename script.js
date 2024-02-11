'use strict';

// Selecting Elements
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Using the OOP architecture to set the code....

/////////////////////////////////////////////
// Creating a parent workout class
class Workout {
    date = new Date();
    id = `${Date.now()}`.slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords; // [lat , lng]
        this.duration = duration; // min
        this.distance = distance; // km
    }

    #setDescription() {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }

    _setDescptionChild() {
        this.#setDescription;
    }
};

// Creating the subclasses from the parent Workout class
class Running extends Workout {
    type = 'running';
    constructor(coords, distance, duration, cadence) {
        super(coords, duration, distance);
        this.cadence = cadence;
        this.calcPace();
        this._setDescptionChild();
    }

    calcPace() {
        // min/km
        this.pace = this.duration / this.distance;
        return this.pace;
    }
};

class Cycling extends Workout {
    type = 'cycling';
    constructor(coords, distance, duration, elevationGain) {
        super(coords, duration, distance);
        this.elevationGain = elevationGain;
        this.calcSpeed();
        this._setDescptionChild();
    }

    calcSpeed() {
        // km/h
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
};

////////////////////////////////////////// 
// Created a Class for the whole Map functionality
class App {
    // Private instance fields
    #map;
    #mapEvent;
    #workouts = [];

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
        // Creating helper functions to clean our main code...
        const validInput = function (...inputs) {
            return inputs.every(input => Number.isFinite(input));
        };

        const allPositive = function (...inputs) {
            return inputs.every(input => input > 0);
        }

        e.preventDefault();


        // Get data from form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const { lat, lng } = this.#mapEvent.latlng;
        let workout;


        // If workout running , create running object
        if (type === 'running') {
            const cadence = +inputCadence.value;
            // Check if data is valid -> Guard Clause
            if (!validInput(distance, duration, cadence) || !allPositive(distance, duration, cadence)) {
                return alert(`The provided input is incorrect⛔⛔`);
            }

            workout = new Running([lat, lng], distance, duration, cadence);
        };


        // If workout cycling , create cycling object
        if (type === 'cycling') {
            const elevation = +inputElevation.value;
            // Check if data is valid -> Guard Clause
            if (!validInput(distance, duration, elevation) || !allPositive(distance, duration)) {
                return alert(`The provided input is incorrect⛔⛔`);
            }

            workout = new Cycling([lat, lng], distance, duration, elevation);
        };


        // Add new object to the workout array
        this.#workouts.push(workout);
        console.log(workout);


        // Render workout on map as marker
        this.#renderMarkerWorkout(workout);

        // Render workout on list
        this.#renderWorkout(workout);

        // Hide form + Clearing Input fields
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
    }

    // Marker method
    #renderMarkerWorkout(workout) {
        L.marker(workout.coords).addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`,
            }))
            .setPopupContent('workout')
            .openPopup();
    }

    #renderWorkout(workout) {
        const html = `
            <li class="workout workout--${workout.type}" data-id="${workout.id}">
                <h2 class="workout__title">Running on April 14</h2>
                <div class="workout__details">
                    <span class="workout__icon">${workout.type === 'running' ? '🏃' : '🚴‍♀️'}</span>
                    <span class="workout__value">${workout.distance}</span>
                    <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⏱</span>
                    <span class="workout__value">${workout.duration}</span>
                    <span class="workout__unit">min</span>
                </div>
            </li>    
        `
    }
};

const app = new App();

