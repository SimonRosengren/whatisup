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

    map = new google.maps.Map(document.getElementById('map'), { //Do I really need this?
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
    service.nearbySearch(request, restaurantCallback);
}

function getDetailedInfoFromId(id){
    var request = {
        placeId: id
    };
    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, setRedirectUrl);
}

function restaurantCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(results)
        $("#restaurant-ul").empty();
        for (let i = 0; i < 5; i++) {
            var name = results[i].name;
            var openStatus;    
            getDetailedInfoFromId(results[i].place_id)
         }
    }
}

function setRedirectUrl(result, status){
    if (result.hasOwnProperty("opening_hours")){
        openStatus = (result.opening_hours.open_now) ? "OPEN" : "CLOSED";
    }
    else{
        openStatus = "NO INFO";
    } 
    var name = result.name;
    if (status == google.maps.places.PlacesServiceStatus.OK) {   
        console.log(result)    
        $("#restaurant-ul").append('<li class="' + result.place_id + '">' + name.toUpperCase() + ' : ' + openStatus +  '</li>');
        $("." + result.place_id).click(function(){
            window.open(result.website)
        })
    }
}