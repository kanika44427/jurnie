(function() {
	angular.module('jurnie').factory('Search', search);

	function search($http, ServerUrl, $q, SweetAlert, $state, $rootScope, $localStorage) {
		var service = {
			search: search,
			getCoords: getCoords,
			getNearby: getNearby
		};

		return service;

		function search(text) {
			var encodedText = encodeURIComponent(text);
			return $http.get(ServerUrl + 'search?searchText=' + encodedText);
		}

		function getCoords(placeId) {
			return $http.get(ServerUrl + 'search/geocode?place_id=' + placeId);
		}

		function getNearby(coords) {
			return $http.get(ServerUrl + 'search/nearby?lat=' + coords.latitude + '&long=' + coords.longitude);
		}
	}
})();
