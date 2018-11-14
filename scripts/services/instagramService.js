angular.module('jurnie').factory("instagramService", function ($rootScope, $location, $http, $localStorage) {
    var client_id = "3f6db4c4a43941339aafa3b9b57ead9b";
    var service = {
        authorize: function () {
            var igPopup = window.open("https://instagram.com/oauth/authorize/?client_id=" + client_id +
                "&redirect_uri=" + $location.absUrl().split('#')[0] +
                "&response_type=token", "igPopup");
        },
        _access_token: null,
        access_token: function (newToken) {
            if (angular.isDefined(newToken)) {
                this._access_token = newToken;
            }
              this._access_token;
        },
        login: function () {

            var url = 'https://api.instagram.com/v1/users/self/?access_token=7913324459.3f6db4c.d5b7a06c81d240dbb4e1a7b89e9f66eb';
            $http(
                {
                 method: 'GET',
                url: url
            }).then(function (data) {
                alert("data");
            });
        }
    };

    $rootScope.$on("igAccessTokenObtained", function (evt, args) {
        service.access_token(args.access_token);
    });
    return service;
});