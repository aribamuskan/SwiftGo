

document.getElementById("bookingForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const pickupAddress = this.elements["pickupAddress"].value;
    const deliveryAddress = this.elements["deliveryAddress"].value;
    const packageDetails = this.elements["packageDetails"].value;

    try {
        const response = await fetch("/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pickupAddress: pickupAddress,
                deliveryAddress: deliveryAddress,
                packageDetails: packageDetails
            })
        });

        const data = await response.json();
        alert(data.message + "\nYour Tracking Number: " + data.trackingNumber);
        this.reset();

    } catch (error) {
        alert("Something went wrong. Please try again.");
    }
});

document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    alert("Your message has been sent successfully!");

    this.reset();
});
async function trackPackage() {
    const trackingNumber = document
        .getElementById("trackingNumber")
        .value
        .trim();

    const result = document.getElementById("trackingResult");

    if (!trackingNumber) {
        result.textContent = "Please enter a tracking number.";
        return;
    }

    try {
        const response = await fetch("/track/" + trackingNumber);
        const data = await response.json();

        if (data.success) {
            result.innerHTML =
                "Package Found!<br>" +
                "Tracking Number: " + data.booking.trackingNumber + "<br>" +
                "Pickup: " + data.booking.pickupAddress + "<br>" +
                "Delivery: " + data.booking.deliveryAddress + "<br>" +
                "Package: " + data.booking.packageDetails + "<br>" +
                "Status: " + data.booking.status;
        } else {
            result.textContent = "Tracking number not found.";
        }

    } catch (error) {
        result.textContent = "Something went wrong. Please try again.";
    }
}
// MOBILE MENU
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector("header nav");

menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
});

// CLOSE MOBILE MENU AFTER CLICKING A LINK
const navLinks = document.querySelectorAll("header nav a");

navLinks.forEach(function(link) {
    link.addEventListener("click", function() {
        navMenu.classList.remove("active");
    });
});