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

    _setDescriptionChild() {
        return this.#setDescription();
    }
};

// Creating the subclasses from the parent Workout class
class Running extends Workout {
    type = 'running';
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDescriptionChild();
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
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
        this._setDescriptionChild();
    }

    calcSpeed() {
        // km/h
        this.speed = (this.distance / (this.duration / 60));
        return this.speed;
    }
};

////////////////////////////////////////// 
// Created a Class for the whole Map functionality
class App {
    // Private instance fields
    #map;
    #mapZoomLevel = 13;
    #mapEvent;
    #workouts = [];

    constructor() {
        // Get user's position
        this.#getPosition();

        // Get the local storage
        this.#getLocalStorage();

        form.addEventListener('submit', this.#newWorkout.bind(this));

        // Adding the listener to the select -> change event
        inputType.addEventListener('change', this.#toggleElevationField);

        // Moving the marker on click
        containerWorkouts.addEventListener('click', this.#moveToPopup.bind(this));
    }

    // To get the location of the device
    #getPosition() {
        navigator.geolocation.getCurrentPosition(this.#loadMap.bind(this), function () {
            alert(`Couldn't retreive your location ☹️☹️`);
        }, { enableHighAccuracy: true, timeout: 10000 });
    }

    // To load and render the map on screen
    #loadMap(position) {
        const { latitude, longitude } = position.coords;

        // Adding the leaflet library
        //  To set the latitude and longitude for our position..
        const coords = [latitude, longitude];
        // 13 -> zoom level
        this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        // Adding the event listener to map object using on() method
        this.#map.on('click', this.#showForm.bind(this));

        // Can only be executed once the map is loaded....
        this.#workouts.forEach(work => {
            this.#renderMarkerWorkout(work);
        });
    }

    // Show the form when clicked on the map
    #showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.toggle('hidden');
        form.classList.toggle('form--transition');
        inputDistance.focus();
    }

    // Toggle the form class
    #toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    // To create the new workout
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
        // console.log(workout);


        // Render workout on map as marker
        this.#renderMarkerWorkout(workout);

        // Render workout on list
        this.#renderWorkout(workout);

        // Hide form + Clearing Input fields
        this.#hideForm();

        // Store the workout in the local storage
        this.#setLocalStorage();
    }

    // Marker method -> To app marker to the map on new workout
    #renderMarkerWorkout(workout) {
        L.marker(workout.coords).addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`,
            }))
            .setPopupContent(`${workout.type === 'running' ? '🏃' : '🚴‍♀️'} ${workout.description}`)
            .openPopup();
    }

    // Adding the workout as a list -> During new workout
    #renderWorkout(workout) {
        let html = `
            <li class="workout workout--${workout.type}" data-id="${workout.id}">
                <h2 class="workout__title">${workout.description}</h2>
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
        `
        // If Running
        if (workout.type === 'running') {
            html += `
                <div class="workout__details">
                    <span class="workout__icon">⚡️</span>
                    <span class="workout__value">${workout.pace.toFixed(1)}</span>
                    <span class="workout__unit">min/km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">🦶🏼</span>
                    <span class="workout__value">${workout.cadence}</span>
                    <span class="workout__unit">spm</span>
                </div>
            </li>
            `;
        }

        // If Cycling
        if (workout.type === 'cycling') {
            html += `
                <div class="workout__details">
                    <span class="workout__icon">⚡️</span>
                    <span class="workout__value">${workout.speed.toFixed(1)}</span>
                    <span class="workout__unit">km/h</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⛰</span>
                    <span class="workout__value">${workout.elevationGain}</span>
                    <span class="workout__unit">m</span>
                </div>
            </li>
            `;
        }

        // Adding it back to the HTML
        form.insertAdjacentHTML('afterend', html);
    }

    // To hide the form and clear the values
    #hideForm() {
        // Empty inputs
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

        form.classList.toggle('hidden');
        form.classList.toggle('form--transition');
    }

    // To move the marker on click
    #moveToPopup(e) {
        const workoutEl = e.target.closest('.workout');

        if (!workoutEl) return;

        const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id);

        // Leaflet library method
        this.#map.setView(workout.coords, this.#mapZoomLevel, {
            animate: true,
            pan: {
                duration: 1,
            }
        })
    }

    // Set the local storage for each workout
    #setLocalStorage() {
        localStorage.setItem('workouts', JSON.stringify(this.#workouts));
    }

    // To get the local storage
    #getLocalStorage() {
        const data = JSON.parse(localStorage.getItem('workouts'));

        if (!data) return;

        // When there is data stored in the local storage
        this.#workouts = data;

        this.#workouts.forEach(work => {
            this.#renderWorkout(work);
        });
    }
};

const app = new App();


/*
    To move the marker on click -> When the page loads there is no workout on the map, so we can't attach an event handler directly to the workout li, so instead we do event delegation and attach an event handler to its parent...
*/

