angular.module('jurnie').factory('httpService', ['$http','ServerUrl',  function ($http, ServerUrl) {
    
      
        var httpService = {
            deleteMarker: deleteMarker,
            socialLogin: socialLogin,
            socialSignup: socialSignup
        };
        
        function deleteMarker(userId,pinId) {
            //alert('Marker deleted');
            return $http.post(ServerUrl + 'pin/deleteUserPin', { pinId: pinId }, { headers: { 'Content-Type': 'application/json' } }).then(function (response) {
                 return response;
             });
             return response;
        }
        function socialLogin(socialUser) {
            return $http.post(ServerUrl + 'user/sociallogin', socialUser, { headers: { 'Content-Type': 'application/json' } }).
                then(function (response) {
                 return response;
             });
        }
        function socialSignup(socialUser) {
            alert('social signup');
            return $http.post(ServerUrl + 'user/socialsignup', socialUser, { headers: { 'Content-Type': 'application/json' } }).
                then(function (response) {
                    return response;
                });
            return response;
        }
        return httpService;
    }]);