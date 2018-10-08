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
			'vcRecaptcha'
		])
		.constant('ServerUrl', 'https://api.jurnie.com/api/v1/');
	// .constant('ServerUrl', 'http://localhost:3000/api/v1/');
})();
