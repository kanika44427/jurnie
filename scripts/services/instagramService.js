
angular.module('jurnie').factory("instagramService", function ($rootScope, $location, $http, $localStorage, $sce) {
    // var client_id = "3f6db4c4a43941339aafa3b9b57ead9b"; // local 
     //var client_id = "5803d3a724ed407ba3ba753bafc1312b"; // uat 
     var client_id = "363b3e1a9dca4fcd85a3cc0354240b0f"; // production 
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

            var url = 'https://api.instagram.com/v1/users/self/?access_token=' + $localStorage.instaToken;
            var trustedUrl = $sce.trustAsResourceUrl(url);
            return $http.jsonp(trustedUrl, { jsonpCallbackParam: 'callback' }).then(function (data) {
                return data;
            });
            return data;
        },
        getInstaMarkers: function () {
            var url = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + $localStorage.instaToken;
            var trustedUrl = $sce.trustAsResourceUrl(url);
            return $http.jsonp(trustedUrl, { jsonpCallbackParam: 'callback' }).then(function (data) {
                return data;
            });
            return data;
        }
    };

    $rootScope.$on("igAccessTokenObtained", function (evt, args) {
        service.access_token(args.access_token);
    });
    return service;
});