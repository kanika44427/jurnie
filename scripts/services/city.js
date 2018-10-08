(function() {
	angular.module('jurnie').factory('City', city);

	function city(ServerUrl, $http, $rootScope, SweetAlert) {
		var service = {
			get: get,
			currCity: null
		};
		return service;

		function get(returnPromise) {
			// if (returnPromise) return $http.get(ServerUrl + 'city');
			return $http.get(ServerUrl + 'city').then(
				function(response) {
					service.currCity = response.data;
					$rootScope.$emit('reload_map', response.data);
					return response.data;
				},
				function(err) {
					console.error(err);
					SweetAlert.swal(
						{
							title: 'Something went wrong...',
							text: err.data && err.data.message ? 'Message: ' + err.data.message : 'Sorry about that!',
							confirmButtonColor: '#00A99D',
							confirmButtonText: 'OK',
							type: 'warning'
						},
						function(isConfirm) {}
					);
				}
			);
		}
	}
})();
