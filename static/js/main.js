let map;
let directionsService;
let directionsRenderer;
let placesService;
let autocomplete;
const locations = [];

function initMap() {
    const singaporeCenter = { lat: 1.3521, lng: 103.8198 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 11,
        center: singaporeCenter,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("directions-panel"));

    placesService = new google.maps.places.PlacesService(map);
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("location-input"),
        { componentRestrictions: { country: "sg" } }
    );

    document.getElementById("add-location").addEventListener("click", addLocation);
    document.getElementById("optimize-route").addEventListener("click", optimizeRoute);
}

function addLocation() {
    const locationInput = document.getElementById("location-input");
    const location = locationInput.value.trim();
    if (location) {
        locations.push(location);
        updateLocationList();
        locationInput.value = "";
    }
}

function updateLocationList() {
    const locationList = document.getElementById("location-list");
    locationList.innerHTML = "";
    locations.forEach((location, index) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.textContent = location;
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger btn-sm";
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteLocation(index);
        li.appendChild(deleteButton);
        locationList.appendChild(li);
    });
}

function deleteLocation(index) {
    locations.splice(index, 1);
    updateLocationList();
}

function optimizeRoute() {
    if (locations.length < 2) {
        alert("Please add at least two locations.");
        return;
    }

    const waypoints = locations.slice(1, -1).map(location => ({ location: location, stopover: true }));
    const request = {
        origin: locations[0],
        destination: locations[locations.length - 1],
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: "DRIVING",
    };

    directionsService.route(request, (result, status) => {
        if (status === "OK") {
            directionsRenderer.setDirections(result);
        } else {
            alert("Directions request failed due to " + status);
        }
    });
}
