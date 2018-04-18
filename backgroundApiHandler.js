
var iFrequency = 8000;
var src1 = document.getElementById("bg1");
var src2 = document.getElementById("bg2");
var bg2Out = true;
var myInterval = 0;


whatisup.backgroundApi = {
    startLoop: function(city) {
        var deparsedCity = city.replace(" ", "%20")
        deparsedCity = deparsedCity.replace("ö", "o")
        console.log(deparsedCity)
        clearInterval(myInterval);
        src1.style.backgroundImage = "url(" +"https://source.unsplash.com/2048x1152/?" + deparsedCity + "&foo=" + Math.random() + ")"
        src2.style.backgroundImage = "url(" + "https://source.unsplash.com/2048x1152/?" + deparsedCity + "&foo=" + Math.random() + ")"
        myInterval = setInterval(whatisup.backgroundApi.loopPictures, iFrequency, deparsedCity);  // run
    }, 

    loopPictures: function(city) {
        if (bg2Out == true) {
            $("#bg2").fadeOut(3000, function () {
                src2.style.backgroundImage = "url(" + "https://source.unsplash.com/2048x1152/?" + city + "&foo=" + Math.random() + ")"
            });
            $("#bg1").fadeIn(3000);
            bg2Out = false;
        }
        else {
            $("#bg2").fadeIn(3000);
            $("#bg1").fadeOut(3000, function () {
                src1.style.backgroundImage = "url(" + "https://source.unsplash.com/2048x1152/?" + city + "&foo=" + Math.random(); + ")"
            });
            bg2Out = true;
        }
    }
}