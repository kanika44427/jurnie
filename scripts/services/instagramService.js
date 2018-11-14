angular.module('jurnie').factory("InstagramService", function ($rootScope, $location, $http) {
    var client_id = "3f6db4c4a43941339aafa3b9b57ead9b";
    var service = {
        login: function () {
            var igPopup = window.open("https://instagram.com/oauth/authorize/?client_id=" + client_id +
                "&redirect_uri=" + $location.absUrl().split('#')[0] +
                "&response_type=token", "igPopup");
        }
    };
    return service;
});