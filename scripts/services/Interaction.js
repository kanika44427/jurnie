(function() {
	angular.module('jurnie').factory('Interaction', interaction);

	function interaction($http, ServerUrl, $q, SweetAlert, $state, $rootScope, $localStorage) {
		var service = {
			getInteractions: getInteractions,
			hasBeenSeen: hasBeenSeen
		};

		return service;

		function getInteractions() {
			return $http.get(ServerUrl + 'interaction');
		}
		function hasBeenSeen(notification) {
			return $http.put(ServerUrl + 'interaction/' + notification.id + '/mark-as-read', {});
		}
	}
})();
