$(document).ready(init)


var service;
var geocoder;

function init() {
    geocoder = new google.maps.Geocoder();
    getLocation();
}

$("#search-form").submit(function (event) {
    getLatLngFromText($(this).serialize());
    event.preventDefault();
})

function getLatLngFromText(text) {
    geocoder.geocode({ 'address': text }, function (results, status) {
        console.log(status)
        if (status == 'OK') {
            console.log(results[0].geometry.location.lat());
            getGoogleMapsInfo({coords: {latitude: results[0].geometry.location.lat(), longitude: results[0].geometry.location.lng()}})
        }
    })
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getGoogleMapsInfo);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}
function getGoogleMapsInfo(position) {
    console.log("Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude);

    var pyrmont = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
    });

    var request = {
        location: pyrmont,
        radius: '500', 
        type: ['restaurant'],
        rankby: 'distance'
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(results)
        $("#restaurant-ul").empty();
        for (let i = 0; i < 5; i++) {
            var name = results[i].name;
            var openStatus;
            if (results[i].hasOwnProperty("opening_hours")){
                openStatus = (results[i].opening_hours.open_now) ? "OPEN" : "CLOSED";
            }
            else{
                openStatus = "NO INFO";
            }

           
            $("#restaurant-ul").append('<li>' + name.toUpperCase() + ' : ' + openStatus +  '</li>')
         }
    }
}