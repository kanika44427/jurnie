angular.module('jurnie').factory('httpService', ['$http', 'ServerUrl','$localStorage',  function ($http, ServerUrl, $localStorage) {
        
    var ServerURL_2 = 'http://api2.thejurnie.com/';
      
        var httpService = {
            deleteMarker: deleteMarker,
            socialLogin: socialLogin,
            socialSignup: socialSignup,
            uploadPhoto: uploadPhoto,
            getAllPhotos: getAllPhotos
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
                    $localStorage.token = response.data.token;
                 return response;
             });
        }
        function uploadPhoto(user) {
            return $.post(ServerURL_2 + 'uploadImage ', user, {
                headers: { 'Content-Type': 'application/json' ,
                    //'Authorization': null,
                    noAuth: true
                }
            }).
                then(function (response) {
                    return response;
                });
        }
        function getAllPhotos(userId, pinId) {
            return $http.get(ServerURL_2 + 'getAllPhotos?userId='+userId + '&pinId=' + pinId, { headers: { 'Content-Type': 'application/json' } }).
                then(function (response) {
                    return response;
                });
        }
        function socialSignup(socialUser) {
            alert(socialUser);
            return $http.post(ServerUrl + 'user/socialsignup', socialUser, { headers: { 'Content-Type': 'application/json' } }).
                then(function (response) {
                    return response;
                });
            return response;
        }
        return httpService;
    }]);