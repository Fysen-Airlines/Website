let name = "";

document.getElementById('booking-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    fetch(`/api/createRazorOrder?6482`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        // Redirect to the checkout page
        var options = {
            "key": "rzp_live_oPygPIIVfv2oof", // Enter the Key ID generated from the Dashboard
            "amount": "6482", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Fysen Airlines", //your business name
            "description": "Travel with Fysen Airlines", //your business description
            "image": "/static/Assets/Fysen1-home.png", //your logo
            "order_id": data['orderId'], //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "callback_url": "https://oss-aryanroy.dev/api/razorpayCallback", 
            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                "name": name, //your customer's name
                "email": "support@fysen.in",
                "contact": "+91-7715846058"
            },
            "notes": {
                "address": "Fysen Corporate Office"
            },
            "theme": {
                "color": "#F37254"
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
        });
        rzp1.open();
    })
    .catch(error => {
        console.error('Error:', error);
    })
});



// razorpay integration

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
                    name = data['name'];
             });
         } else {
        window.href = '/fysen/website/login'
                console.log('User is not logged in');
         }
     });
 });


 function fetchInfoAutofill() {

    document.getElementById('first_name').value = "Krishna";
    document.getElementById('last_name').value = "Reddy"
    document.getElementById('email').value = "krishan.reddy@example.com"
    document.getElementById('contact_number').value = "1098765432";
    let seatPref = "window";
    if (seatPref == "window") {
        // generate a wubdiw seat number
        document.getElementById('seat_number').value = "12A";
    } else {
        // generate a middle seat number
        document.getElementById('seat_number').value = "25C";
    }
    document.getElementById('food_preference').value = "vegetarian";
    
    document.getElementById('source').value = "BOM";
    document.getElementById('destination').value = "DEL";
}


document.addEventListener('DOMContentLoaded', function () {
    fetchInfoAutofill();
});