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
                document.getElementById("first-name").innerText = username.split(' ')[0];
                document.getElementById("last-name").innerText = username.split(' ')[1];
            });
        } else {
            window.location.href = '/fysen/website/login';
            console.log('User is not logged in');
        }
    });
});