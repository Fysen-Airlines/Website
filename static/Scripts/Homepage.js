function isUserLoggedIn() {
    return localStorage.getItem("user") !== null;
}

async function getFlights() {
    const response = await fetch('http://127.0.0.1:8000/flights', {
        method: 'GET',
        credentials: 'include' // This ensures cookies are sent with the request
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
    } else {
        console.error('Failed to fetch data');
    }
}

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
                console.log('User is not logged in');
         }
     });
 });