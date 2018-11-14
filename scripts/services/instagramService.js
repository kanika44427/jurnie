angular.module('jurnie').factory("instagramService", function ($rootScope, $location, $http) {
    var client_id = "3f6db4c4a43941339aafa3b9b57ead9b";
    var service = {
        login: function () {
            var igPopup = window.open("https://instagram.com/oauth/authorize/?client_id=" + client_id +
                "&redirect_uri=" + $location.absUrl().split('#')[0] +
                "&response_type=token", "igPopup");
        },
        _access_token: null,
        access_token: function (newToken) {
            if (angular.isDefined(newToken)) {
                this._access_token = newToken;
            }
            return this._access_token;
        },
    };

    $rootScope.$on("igAccessTokenObtained", function (evt, args) {
        service.access_token(args.access_token);
    });
    return service;
});