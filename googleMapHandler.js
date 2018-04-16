var geocoder;

whatisup.googleMapApi = {
    init: function (e) {
        geocoder = new google.maps.Geocoder();
        this.searchWithLocation();
    },

    updateInformation: function(searchValue) {
        whatisup.songkickApi.getInfoFromSongKick(searchValue);
        whatisup.backgroundApi.startLoop(searchValue);
        whatisup.weatherApi.getWeatherInfo(searchValue);
        whatisup.googleMapApi.getGoogleInfoFromText(searchValue);
    },

    getGoogleInfoFromText: function(text) {
        var parsedText = text.replace(/%20/g, " ");
        geocoder.geocode({ 'address': parsedText }, function (results, status) {
            if (status == 'OK') {
                whatisup.googleMapApi.getInformationFromPosition({ coords: { latitude: results[0].geometry.location.lat(), longitude: results[0].geometry.location.lng() } })
            }
        })
    },

    searchWithLocation: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getInformationFromPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    },
    
    textSearchWithLatLng: function(latlng) {
        geocoder.geocode({ 'location': latlng }, function (results, status) {
            if (status == 'OK') {
                var arrAddress = results[0].address_components; //Get the adress components. If one of them has type "locality" we know that that will be the name of the city
                // iterate through address_component array
                $.each(arrAddress, function (i, address_component) {
                    if (address_component.types[0] == "locality"){
                        whatisup.songkickApi.getInfoFromSongKick(address_component.long_name);
                        whatisup.backgroundApi.startLoop(address_component.long_name);
                        whatisup.weatherApi.getWeatherInfo(address_component.long_name);
                    } // locality type
                });
            }
        })
    },
    

    getInformationFromPosition: function (position) {
        //Picture, songkick and weather info
        var latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        whatisup.googleMapApi.textSearchWithLatLng(latlng);

        //Restaurant info
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
    }, 

    getDetailedInfoFromId: function(id) {
        var request = {
            placeId: id
        };
        service = new google.maps.places.PlacesService(map);
        service.getDetails(request, setRedirectUrl);
    }
}
var restaurantCallback = function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        $("#restaurant-div").empty();
        $("#restaurant-div").append('<ul id="restaurant-ul"></ul>')
        for (let i = 0; i < 15; i++) {
            var name = results[i].name;
            var openStatus;
            whatisup.googleMapApi.getDetailedInfoFromId(results[i].place_id)
        }
    }
}

var setRedirectUrl = function(result, status) {
    if (status == 'OK') { //Here we sometimes get OVER_QUERY_LIMIT
        if (result.hasOwnProperty("opening_hours")) {
            openStatus = (result.opening_hours.open_now) ? "OPEN" : "CLOSED";
        }
        else {
            openStatus = "NO INFO";
        }
        var name = result.name;
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            $("#restaurant-ul").append('<li class="' + result.place_id + '">' + name.toUpperCase() + ' : ' + openStatus + '</li>');
            $("." + result.place_id).click(function () {
                window.open(result.website)
            })
        }
    }
}