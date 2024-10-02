fetch(
    '/api/isUserLoggedIn',
    {
        method: 'GET',
        credentials: 'include'
    },
).then(response => {
    if (response.ok) {
        window.location.href = '/fysen/website';
    }
});

function postRegister(event) {
    event.preventDefault(); // Prevent the form from submitting and reloading the page

    var firstName = document.getElementById("first-name").value;
    var lastName = document.getElementById("last-name").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;
    var email = document.getElementById("email").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return false;
    }

    var data = {
        first_name: firstName,
        last_name: lastName,
        password: password,
        email: email
    };

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            console.log('User registered successfully');
            window.location.href = '/fysen/website/login';
        } else {
            console.error('Failed to register user');
        }
    });
    return false;
}
