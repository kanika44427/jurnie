(function() {
	angular
		.module('jurnie', [
			'ui.router',
			'oitozero.ngSweetAlert',
			'angularModalService',
			'ngStorage',
			'ui.bootstrap',
			'ngTouch',
			'ngAnimate',
			'angular-rating',
			'toastr',
			'vcRecaptcha',
           
		])
         .config(['$httpProvider', function ($httpProvider) {
            //Enable cross domain calls
            $httpProvider.defaults.useXDomain = true;
            //Remove the header used to identify ajax call  that would prevent CORS from working
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }])
		.constant('ServerUrl', 'https://api.jurnie.com/api/v1/');
	// .constant('ServerUrl', 'http://localhost:3000/api/v1/');
})();
