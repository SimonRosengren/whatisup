whatisup.songkickApi = {
    getInfoFromSongKick: function(place) {
        var url = "http://api.songkick.com/api/3.0/search/locations.json?query=" + place + "&apikey=" + songkickApiKey;
        $.get(url, function (data, status) {
            if (status == 'success') {
                whatisup.songkickApi.sendRequestToSongkickWithId(data.resultsPage.results.location[0].metroArea.id);
            }
            else {
                console.log("This city is probably too small!");
            }
        })
    }, 

    sendRequestToSongkickWithId: function(id) {
        var url = "http://api.songkick.com/api/3.0/metro_areas/" + id + "/calendar.json?apikey=" + songkickApiKey;
        $.get(url, function (data, status) {
            if (status == 'success') {
                whatisup.songkickApi.fillEventList(data);
            }
            else {
                console.log("This city is probably too small!");
            }
        })
    }, 

    fillEventList: function(data) {
        $("#event-div").empty();
        $("#event-div").append('<ul id="event-ul"></ul>')
        for (let i = 0; i < 15; i++) {
            $("#event-ul").append('<li id="' + data.resultsPage.results.event[i].id + '">' + data.resultsPage.results.event[i].displayName + '</li>')
            $("#" + data.resultsPage.results.event[i].id).click(function () {
                window.open(data.resultsPage.results.event[i].uri)
            })
        }
    }
}