angular.module('jurnie').factory('httpService', ['$http', 'ServerUrl','$localStorage',  function ($http, ServerUrl, $localStorage) {
        
    //var ServerURL_2 = 'http://api2.thejurnie.com/';
    var ServerURL_2 = 'https://api2.jurnie.com/';
      
    //var ServerURL_2 = 'http://localhost:8084/';

        var httpService = {
            deleteMarker: deleteMarker,
            socialLogin: socialLogin,
            socialSignup: socialSignup,
            uploadPhoto: uploadPhoto,
            getAllPhotos: getAllPhotos,
            getHelloWorld: getHelloWorld,
            deleteImage: deleteImage,
            uploadInstaImage: uploadInstaImage,
            updateInstaImage: updateInstaImage
            
        };
        
        function deleteMarker(userId,pinId) {
            //alert('Marker deleted');
            return $.get(ServerURL_2 + 'deleteMarker?userId=' + userId + '&pinId=' + pinId, { headers: { 'Content-Type': 'application/json' } }).
                then(function (response) {
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

        function uploadInstaImage(imageObj) {
            //return $http.post(ServerURL_2 + 'uploadInstaImage', imageObj, { headers: { 'Content-Type': 'application/json' } }).
            //    then(function (response) {
            //        return response;
            //    });

            return $.ajax({
                url: ServerURL_2 + 'uploadInstaImage',
                data: JSON.stringify(imageObj),
                dataType: 'json',
                type: 'POST',
                contentType : "application/json", 
                success: function (data) {
                    return data;
                }
            });
        }
        
        function updateInstaImage(imageObj) {
            return $.ajax({
                url: ServerURL_2 + 'updateInstaImage',
                data: JSON.stringify(imageObj),
                dataType: 'json',
                type: 'POST',
                contentType: "application/json",
                success: function (data) {
                    return data;
                }
            });
        }

        function getHelloWorld() {
            return $.get(ServerURL_2 + 'getHelloWorld').
                then(function (response) {
                   
                    return response;
                });
        }
        function uploadPhoto(user) {
            //return $.post(ServerURL_2 + 'uploadImage', user, {
            //    headers: {
            //        //contentType: false,
            //        //'Content-Type': undefined,
            //        //'Authorization': null,
            //        noAuth: true
            //    }
            //}).
            //    then(function (response) {
            //        return response;
            //    });
            return $.ajax({
                url: ServerURL_2 + 'uploadImage',
                data: user,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (data) {
                    return data;
                }
            });

        }
        function getAllPhotos(userId, pinId) {
            return $.get(ServerURL_2 + 'getAllPhotos?userId=' + userId + '&pinId=' + pinId, { headers: { 'Content-Type': 'application/json' } }).
                then(function (response) {
                    return response;
                });
        }
        function deleteImage(id, photoUrl) {
            return $.get(ServerURL_2 + 'deleteImage?id=' + id + '&image=' + photoUrl, { headers: { 'Content-Type': 'application/json' } }).
                then(function (response) {
                    return response;
                });
        }
        function socialSignup(socialUser) {
            //alert(socialUser);
            return $http.post(ServerUrl + 'user/socialsignup', socialUser, { headers: { 'Content-Type': 'application/json' } }).
                then(function (response) {
                    $localStorage.token = response.data.token;
                    return response;
                });
        }
        return httpService;
    }]);