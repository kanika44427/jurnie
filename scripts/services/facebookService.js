
angular.module('jurnie').factory('facebookService', function ($q) {
    return {
        login: function () {
            var deferred = $q.defer();
            FB.login(function (response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    if (response.authResponse) {
                        console.log('Welcome!  Fetching your information.... ');
                        FB.api('/me?fields=id,name,email,first_name,last_name,age_range,picture.type(large)', function (response) {

                            deferred.resolve(response);
                        });
                    } else {
                        deferred.reject('Error occured');
                    }
                }
            });
            return deferred.promise;
        }
    }
});