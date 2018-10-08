(function() {
	angular.module('jurnie').factory('TravellerType', travellerType);

	function travellerType(ServerUrl, $http) {
		var service = {
			list: list,
			staticList: []
		};
		return service;

		function list() {
			return $http.get(ServerUrl + 'travellerType').then(function(response) {
				service.staticList = response.data;
				return response;
			});
		}
	}
})();
