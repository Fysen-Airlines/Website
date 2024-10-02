// fetch(
//     '/api/isUserLoggedIn',
//     {
//         method: 'GET',
//         credentials: 'include'
//     },
// ).then(response => {
//     if (response.ok) {
//         window.location.href = '/fysen/website';
//     }
// });

function postLogin(event) {

    event.preventDefault(); // Prevent the form from submitting and reloading the page

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var data = {
        email: email,
        password: password
    };

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            console.log('User logged in successfully');
            window.location.href = '/fysen/website';
        } else {
            console.error('Failed to login user');
        }
    });
    return false;
}

// on DOMContentLoaded
