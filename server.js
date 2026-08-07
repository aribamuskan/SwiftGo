const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ADMIN LOGIN
app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "SwiftGo123") {
        res.json({
            success: true,
            message: "Login successful"
        });
    } else {
        res.status(401).json({
            success: false,
            message: "Invalid username or password"
        });
    }
});
app.post("/book", (req, res) => {
    const { pickupAddress, deliveryAddress, packageDetails } = req.body;
const trackingNumber = "SW" + Date.now();
const newBooking = {
    trackingNumber: trackingNumber,
    pickupAddress: pickupAddress,
    deliveryAddress: deliveryAddress,
    packageDetails: packageDetails,
    status: "Booked",
    date: new Date().toLocaleString()
};
const bookings = JSON.parse(fs.readFileSync('booking.json', 'utf8'));
bookings.push(newBooking);
fs.writeFileSync('booking.json', JSON.stringify(bookings, null, 2));
    console.log("New Booking:");
    console.log("Pickup:", pickupAddress);
    console.log("Delivery:", deliveryAddress);
    console.log("Package:", packageDetails);

  res.json({
    message: "Your pickup has been booked successfully!",
    trackingNumber: trackingNumber
});
});
app.get("/track/:trackingNumber", (req, res) => {
    const trackingNumber = req.params.trackingNumber;

    const bookings = JSON.parse(
        fs.readFileSync("booking.json", "utf8")
    );

    const booking = bookings.find(
        item => item.trackingNumber === trackingNumber
    );

    if (booking) {
        res.json({
            success: true,
            booking: booking
        });
    } else {
        res.status(404).json({
            success: false,
            message: "Tracking number not found."
        });
    }
});
// ADMIN - GET ALL BOOKINGS
app.get("/api/bookings", (req, res) => {
    const bookings = JSON.parse(
        fs.readFileSync("booking.json", "utf8")
    );

    res.json({
        success: true,
        bookings: bookings
    });
});
// ADMIN - UPDATE PACKAGE STATUS
app.put("/api/bookings/:trackingNumber/status", (req, res) => {
    const trackingNumber = req.params.trackingNumber;
    const { status } = req.body;

    const bookings = JSON.parse(
        fs.readFileSync("booking.json", "utf8")
    );

    const booking = bookings.find(
        item => item.trackingNumber === trackingNumber
    );

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: "Booking not found."
        });
    }

    booking.status = status;

    fs.writeFileSync(
        "booking.json",
        JSON.stringify(bookings, null, 2)
    );

    res.json({
        success: true,
        message: "Status updated successfully.",
        booking: booking
    });
});

// ADMIN - DELETE BOOKING
app.delete("/api/bookings/:trackingNumber", (req, res) => {
    const trackingNumber = req.params.trackingNumber;

    let bookings = JSON.parse(
        fs.readFileSync("booking.json", "utf8")
    );

    const bookingIndex = bookings.findIndex(
        item => item.trackingNumber === trackingNumber
    );

    if (bookingIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Booking not found."
        });
    }

    bookings.splice(bookingIndex, 1);

    fs.writeFileSync(
        "booking.json",
        JSON.stringify(bookings, null, 2)
    );

    res.json({
        success: true,
        message: "Booking deleted successfully."
    });
});
// ADMIN - ADD NEW BOOKING
app.post("/api/bookings", (req, res) => {
    const { pickup, delivery, packageDetails } = req.body;

    if (!pickup || !delivery || !packageDetails) {
        return res.status(400).json({
            success: false,
            message: "Please fill all fields."
        });
    }

    const bookings = JSON.parse(
        fs.readFileSync("booking.json", "utf8")
    );

 const newBooking = {
    trackingNumber: "SW" + Date.now(),
    pickupAddress: pickup,
    deliveryAddress: delivery,
    packageDetails: packageDetails,
    status: "Booked",
    date: new Date().toLocaleString()
};

    bookings.push(newBooking);

    fs.writeFileSync(
        "booking.json",
        JSON.stringify(bookings, null, 2)
    );

    res.json({
        success: true,
        message: "Booking added successfully.",
        booking: newBooking
    });
});

// ADMIN - EDIT BOOKING
app.put("/api/bookings/:trackingNumber/edit", (req, res) => {
    const trackingNumber = req.params.trackingNumber;
    const { pickupAddress, deliveryAddress, packageDetails } = req.body;

    const bookings = JSON.parse(
        fs.readFileSync("booking.json", "utf8")
    );

    const booking = bookings.find(
        item => item.trackingNumber === trackingNumber
    );

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: "Booking not found."
        });
    }

    booking.pickupAddress = pickupAddress;
    booking.deliveryAddress = deliveryAddress;
    booking.packageDetails = packageDetails;

    fs.writeFileSync(
        "booking.json",
        JSON.stringify(bookings, null, 2)
    );

    res.json({
        success: true,
        message: "Booking updated successfully.",
        booking: booking
    });
});
app.listen(PORT, () => {
    console.log(`SwiftGo server running at http://localhost:${PORT}`);
});