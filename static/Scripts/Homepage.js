function isUserLoggedIn() {
    return localStorage.getItem("user") !== null;
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
                document.getElementsByClassName("login")[0].href = "/fysen/website/profile";

            });
        } else {
            console.log('User is not logged in');
        }
    });
});