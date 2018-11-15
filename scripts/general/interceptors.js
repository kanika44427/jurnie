(function() {
	angular.module('jurnie').config(function($httpProvider) {
		$httpProvider.defaults.useXDomain = true;
	    delete $httpProvider.defaults.headers.common['X-Requested-With'];
		 $httpProvider.defaults.withCredentials = true; //allow cookies
		 //$httpProvider.interceptors.push(function($q, $location, $rootScope, ServerUrl, $localStorage, PageLoad) {
		$httpProvider.interceptors.push(function($q, $location, $rootScope, ServerUrl, $localStorage) {
			return {
				request: function(config) {
					config.headers = config.headers || {};
					config.headers.authentication = $localStorage.token;
					return config;
				},
				responseError: function(response) {
					if (response.status === 401) {
						$localStorage.token = null;
						// if (PageLoad.done) $rootScope.$emit('logout');
						$rootScope.$emit('logout');
					}
					return $q.reject(response);
				}
			};
		});
	});
})();
