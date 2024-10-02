document.addEventListener('DOMContentLoaded', () => {
    const flightOptionButtons = document.querySelectorAll('.search-options .btn');
    const navLinks = document.querySelectorAll('.nav-links a');
    const returnDateInput = document.querySelector('#return-date'); // Return Date input

    const resultsSection = document.querySelector('.results-section');

    // Initially disable the return date input when the page loads
    returnDateInput.disabled = true;

    // Toggle flight option active class and enable/disable return date input
    flightOptionButtons.forEach((button) => {
        button.addEventListener('click', function () {
            flightOptionButtons.forEach((btn) => btn.classList.remove('active'));
            this.classList.add('active');

            if (this.id === 'round-trip-btn') {
                returnDateInput.disabled = false; // Enable return date when "Round-Trip" is selected
            } else {
                returnDateInput.disabled = true;  // Disable return date for "One-Way" and "Multi-City"
                returnDateInput.value = '';       // Clear return date value if disabled
            }
        });
    });

    // Handle navbar link highlighting
    navLinks.forEach((link) => {
        link.addEventListener('click', function () {
            navLinks.forEach((lnk) => lnk.classList.remove('active-link'));
            this.classList.add('active-link');
        });
    });

    // Function to render flight results
    const renderFlightResults = (flights) => {
        resultsSection.innerHTML = ''; // Clear previous results
        flights.forEach((flight) => {
            const flightResultDiv = document.createElement('div');
            flightResultDiv.className = 'flight-result';

            flightResultDiv.innerHTML = `
                <div class="flight-time">${flight.time} ${flight.route}</div>
                <div class="flight-duration">${flight.duration}</div>
                <div class="flight-price">${flight.price}</div>
                <button class="choose-btn">Book</button>
            `;

            resultsSection.appendChild(flightResultDiv);
        });
    };

    // Data for flights (mock data)
    const flightsData = {
        directFlights: [
            { time: '09:00', route: 'DAC → LHR', duration: '10h 30m, direct', price: 'TP 12,000' },
            { time: '15:30', route: 'GOT → TYO', duration: '11h 20m, direct', price: 'TP 15,500' }
        ],
        layoverFlights: [
            { time: '21:00', route: 'DAC → LHR → CXB', duration: '12h 45m, 1 stop', price: 'TP 16,200' },
            { time: '18:00', route: 'GOT → LHR → TYO', duration: '14h 15m, 2 stops', price: 'TP 18,500' }
        ]
    };

    // Search button functionality
    document.querySelector('.search-btn').addEventListener('click', () => {
        const flyingFrom = document.querySelector('#flying-from').value;
        const flyingTo = document.querySelector('#flying-to').value;
        const departureDate = document.querySelector('#departure-date').value;
        const returnDate = document.querySelector('#return-date').value;

        if (flyingFrom && flyingTo && departureDate) {
            // Check if round-trip is selected, and ensure return date is filled in that case
            if (document.querySelector('#round-trip-btn').classList.contains('active') && !returnDate) {
                alert('Please enter a return date for round-trip flights.');
                return;
            }

            // Determine the selected trip type and display the appropriate results
            if (document.querySelector('#one-way-btn').classList.contains('active')) {
                renderFlightResults(flightsData.directFlights); // Show only direct flights for one-way
            } else if (document.querySelector('#multi-city-btn').classList.contains('active')) {
                renderFlightResults(flightsData.layoverFlights); // Show layover flights for multi-city
            } else {
                renderFlightResults([...flightsData.directFlights, ...flightsData.layoverFlights]); // Round trip can show both
            }
        } else {
            alert('Please fill in the required flight details.');
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    fetch(
     'https://oss-aryanroy.dev/api/isUserLoggedIn',
     {
         method: 'GET',
         credentials: 'include'
     },
     ).then(response => {
         if (response.ok) {
                response.json().then(data => {
                 let username = data['name'];
                 document.getElementsByClassName("login")[0].innerText = "Welcome, " + username;
             });
         } else {
		window.href = '/fysen/website/login'
                console.log('User is not logged in');
         }
     });
 });


function redirectFlights() {
    window.href = "/fysen/website/flights"
}
