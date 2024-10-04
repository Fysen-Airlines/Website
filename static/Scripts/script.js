        // Data for seat rows, columns, and pricing
        const seatRows1 = 19; // Total number of rows
        const seatColumns1 = ['A', 'B']; // Seat columns
        const seatWidth1 = 40; // Seat width in px
        const seatHeight1 = 50; // Seat height in px
        const seatTopOffset1 = 320; // Top offset for seat placement
        const seatLeftOffset1 = 130; // Left offset for seat placement

        // Price mapping for seat columns
        const seatPrices1 = {
            'A': 150, 'B': 120
        };
        // Data for seat rows, columns, and pricing
        const seatRows2 = 19; // Total number of rows
        const seatColumns2 = ['C', 'D']; // Seat columns
        const seatWidth2 = 40; // Seat width in px
        const seatHeight2 = 50; // Seat height in px
        const seatTopOffset2 = 320; // Top offset for seat placement
        const seatLeftOffset2 = 130; // Left offset for seat placement

        // Price mapping for seat columns
        const seatPrices2 = {
            'C': 150, 'D': 120
        };

// Function to create seat elements dynamically based on row and column
function generateSeats() {
    const seatContainer = document.querySelector('.floorplan-img'); // Get the container for seats

    for (let row1 = 1; row <= seatRows; row++) {
        seatColumns.forEach((column, colIndex) => {
            // Create seat div
            const seatDiv = document.createElement('div');
            seatDiv.classList.add('seat');

            // Set dynamic position based on seat row and column
            seatDiv.style.top = `${seatTopOffset + row * seatHeight}px`;
            seatDiv.style.left = `${seatLeftOffset + colIndex * seatWidth}px`;

            const seatNumber = `${column}${row}`; // e.g., A1, B1, etc.
            const price = seatPrices[column]; // Price based on column

            // Add onclick function to book the seat
            seatDiv.setAttribute('onclick', `bookSeat('${seatNumber}', ${price})`);

            // Create seat-info div for seat details
            const seatInfoDiv = document.createElement('div');
            seatInfoDiv.classList.add('seat-info');
            seatInfoDiv.innerHTML = `
                Seat ${seatNumber}<br>
                Price: $${price}<br>
                <button onclick="bookSeat('${seatNumber}', ${price})">Book Now</button>
            `;

            // Append seat-info to seat div
            seatDiv.appendChild(seatInfoDiv);

            // Append seat div to the container
            seatContainer.appendChild(seatDiv);
        });
    }
}

// Call the function to generate seats
generateSeats();

// Function for booking a seat
function bookSeat(seatNumber, price) {
    const confirmBooking = confirm(`Do you want to book seat ${seatNumber} for $₹{price}?`);
    if (confirmBooking) {
        alert(`Seat ${seatNumber} booked successfully!`);
        // Add booking logic here
    }
}
