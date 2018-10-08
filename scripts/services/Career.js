(function() {
	angular.module('jurnie').factory('Career', career);

	function career($http, ServerUrl, $q, SweetAlert, $state, $rootScope, $localStorage) {
		var service = {
			postInquiry: postInquiry
		};

		return service;

		function postInquiry(obj) {
			return $http.post(ServerUrl + 'careerInquiry', obj).then(function(response) {
				// console.log('resume submitted!');
			});
		}
	}
})();
