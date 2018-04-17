const songkickApiKey = "ehoRcRboyl0i3Ovg";
var whatisup = { //Main obj
    init: function () {
        for (var prop in whatisup) { //Loop through all children of main obj
            let child = whatisup[prop];
            if (typeof child === 'object' && child.hasOwnProperty('init')) { //If the child has an init function, call that function
                child.init();
            }
        }
    }
}


$("#search-form").submit(function (event) {
    event.preventDefault();
    setLoadingIcons();
    var search = $(this).serialize();
    search = search.split('=');
    search = search[1];
    search = decodeURI(search);
    search = search.replace(" ", "%20");
    whatisup.googleMapApi.updateInformation(search)

})


$(document).ready(function() {
    setLoadingIcons();
    whatisup.init();
}) //Call the main init once doc is loaded


function setLoadingIcons() {
    $("#restaurant-div").empty();
    $("#temp-div").empty();
    $("#event-div").empty();
    $("#restaurant-div").append('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
    $("#temp-div").append('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
    $("#event-div").append('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
}
