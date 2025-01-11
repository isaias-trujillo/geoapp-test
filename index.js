let map, marker;

const initializeMap = () => {
    // Initialize the map
    map = L.map('map').setView([0, 0], 20); // Default position at [0, 0] with zoom 13

    // Add a tile layer (you can use other tile providers like OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add a marker (we'll update its position in real-time)
    marker = L.marker([0, 0]).addTo(map);
};

const updatePosition = (latitude, longitude) => {
    // Update the marker's position
    marker.setLatLng([latitude, longitude]);
    // Center the map on the new position
    map.setView([latitude, longitude], map.getZoom());
    document.getElementById('status').textContent = `Tracking: Latitude ${latitude.toFixed(6)}, Longitude ${longitude.toFixed(6)}`;
};

const showPosition = (position) => {
    const { latitude, longitude } = position.coords;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    updatePosition(latitude, longitude);
};

const handleError = (error) => {
    const errorMessages = {
        [error.PERMISSION_DENIED]: "Permission denied. Enable location services to track in real-time.",
        [error.POSITION_UNAVAILABLE]: "Position unavailable. Check your network or GPS.",
        [error.TIMEOUT]: "Location request timed out. Try again.",
    };
    document.getElementById('status').textContent = errorMessages[error.code] || "An unknown error occurred.";
};

if (navigator.geolocation) {
    // Initialize the map once geolocation is supported
    initializeMap();

    // Start real-time tracking
    navigator.geolocation.watchPosition(showPosition, handleError, {
        enableHighAccuracy: true, // Use GPS for better accuracy
        maximumAge: 0,            // Do not cache location data
        timeout: 5000             // Timeout after 5 seconds
    });
} else {
    document.getElementById('status').textContent = "Geolocation is not supported by your browser.";
}
