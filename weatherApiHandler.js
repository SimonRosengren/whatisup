whatisup.weatherApi = {
    getWeatherInfo: function(place) {
        var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + place + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        $.get(url, function (data, status) {
            var tempInF = data.query.results.channel.item.condition.temp;
            var tempInC = ((tempInF - 32) * 5) / 9
            $("#temp-div").empty();
            $("#temp-div").append('<h1 id="temperature">' + Math.ceil(tempInC) + '° <i class="wi wi-yahoo-' + data.query.results.channel.item.condition.code +'" ></i></h1>');

        })
    }
}