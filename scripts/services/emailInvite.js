(function() {
	angular.module('jurnie').factory('EmailInvite', emailInvite);

	function emailInvite($http, ServerUrl) {
		var service = {
			grab: grab,
			add: add
		};
		return service;

		function grab(id) {
			return $http.get(ServerUrl + 'friendship/invite/email/' + id);
		}

		function add(friends) {
			return $http.post(ServerUrl + 'friendship/invite/email', friends);
		}
	}
})();
