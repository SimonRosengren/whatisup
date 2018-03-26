$(document).ready(init)

var service;
var geocoder;
var myInterval = 0;

const songkickApiKey = "ehoRcRboyl0i3Ovg";

function init() {
    geocoder = new google.maps.Geocoder();
    setLoadingIcons();
    getLocation();
}

function setLoadingIcons() {
    $("#restaurant-div").append('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
    $("#pos-div").append('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
    $("#event-div").append('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
}

$("#search-form").submit(function (event) {

    var search = $(this).serialize();
    search = search.split('=');
    search = search[1];
    console.log(search)
    getLatLngFromText(search);
    getBgPictures(search);
    getInfoFromSongkick(search);
    event.preventDefault();
})

function getLatLngFromText(text) {
    geocoder.geocode({ 'address': text }, function (results, status) {
        if (status == 'OK') {
            getGoogleMapsInfo({ coords: { latitude: results[0].geometry.location.lat(), longitude: results[0].geometry.location.lng() } })
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



    var latlng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status == 'OK') {
            /*var place = results[3].formatted_address;
            var city = place.split(',');
            getBgPictures(city[0]);*/

        }
    })



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

function getDetailedInfoFromId(id) {
    var request = {
        placeId: id
    };
    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, setRedirectUrl);
}

function restaurantCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        $("#restaurant-div").empty();
        $("#restaurant-div").append('<ul id="restaurant-ul"></ul>')
        for (let i = 0; i < 15; i++) {
            var name = results[i].name;
            var openStatus;
            getDetailedInfoFromId(results[i].place_id)
        }
    }
}

function setRedirectUrl(result, status) {
    if (result.hasOwnProperty("opening_hours")) {
        openStatus = (result.opening_hours.open_now) ? "OPEN" : "CLOSED";
    }
    else {
        openStatus = "NO INFO";
    }
    var name = result.name;
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(result)
        $("#restaurant-ul").append('<li class="' + result.place_id + '">' + name.toUpperCase() + ' : ' + openStatus + '</li>');
        $("." + result.place_id).click(function () {
            window.open(result.website)
        })
    }
}
//FLICKR
//https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
var bgPic = [];

function getBgPictures(city) {

    console.log(city)
    bgPic = [];
    $.ajax({
        url: " https://api.flickr.com/services/rest/?method=flickr.photos.search&privacy_filter=1&api_key=dc55321147eb831fb3d20caeb2367882&text=" + city + "&sort=relevance&format=json&nojsoncallback=1",
        type: "GET",
        success: function (result) {

            for (var i = 0; i < 10; i++) {
                bgPic.push("https://farm" + result.photos.photo[i].farm + ".staticflickr.com/" + result.photos.photo[i].server + "/" + result.photos.photo[i].id + "_" + result.photos.photo[i].secret + ".jpg")
            }
            startLoop();
        }
    })
}

var counter = 0;
var iFrequency = 8000;
var src1 = document.getElementById("bg1");
var src2 = document.getElementById("bg2");

function startLoop() {
    clearInterval(myInterval);
    console.log("removed myInterval");
    src1.style.backgroundImage = "url(" + bgPic[counter] + ")"
    counter++;
    src2.style.backgroundImage = "url(" + bgPic[counter] + ")"
    myInterval = setInterval(LoopPictures, iFrequency);  // run
    console.log("A interval has been created!")
}

var bg2Out = true;
function LoopPictures() {
    counter++;
    if (counter >= 10)
        counter = 0;
    if (bg2Out == true) {
        $("#bg2").fadeOut(3000, function () {
            src2.style.backgroundImage = "url(" + bgPic[counter] + ")"
        });
        $("#bg1").fadeIn(3000);
        bg2Out = false;
    }
    else {
        $("#bg2").fadeIn(3000);
        $("#bg1").fadeOut(3000, function () {
            src1.style.backgroundImage = "url(" + bgPic[counter] + ")"
        });
        bg2Out = true;
    }
}

function getInfoFromSongkick(place) {
    var url = "http://api.songkick.com/api/3.0/search/locations.json?query=" + place + "&apikey=" + songkickApiKey;
    $.get(url, function (data, status) {
        console.log(status)
        if (status == 'success') {
            sendRequestToSongkickWithId(data.resultsPage.results.location[0].metroArea.id);
        }
        else {
            console.log("This city is probably too small!");
        }
    })
}

function sendRequestToSongkickWithId(id) {
    var url = "http://api.songkick.com/api/3.0/metro_areas/" + id + "/calendar.json?apikey=" + songkickApiKey;
    $.get(url, function (data, status) {
        console.log(status)
        if (status == 'success') {
            console.log(data)
            fillEventList(data);
        }
        else {
            console.log("This city is probably too small!");
        }
    })
}

function fillEventList(data) {
    $("#event-div").empty();
    $("#event-div").append('<ul id="event-ul"></ul>')
    for (let i = 0; i < 15; i++) {
        $("#event-ul").append('<li id="' + data.resultsPage.results.event[i].id + '">' + data.resultsPage.results.event[i].displayName + '</li>')
        $("#" + data.resultsPage.results.event[i].id).click(function(){
            window.open(data.resultsPage.results.event[i].uri)
        })
    }
}
