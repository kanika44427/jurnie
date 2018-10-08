(function() {
	angular.module('jurnie').factory('FBInvite', fbInvite);

	function fbInvite($http, ServerUrl) {
		var service = {
			add: add,
			grab: grab
		};
		return service;

		function add() {
			return $http.post(ServerUrl + 'friendship/invite/fb');
		}

		function grab(id) {
			return $http.get(ServerUrl + 'friendship/invite/fb/' + id);
		}
	}
})();
