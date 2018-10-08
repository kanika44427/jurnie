(function() {
	angular.module('jurnie').factory('Friend', friend);

	function friend($http, ServerUrl, $q, SweetAlert, $state, $rootScope, $localStorage) {
		var service = {
			acceptFriend: acceptFriend,
			denyFriend: denyFriend,
			inviteFriend: inviteFriend,
			getNonFriend: getNonFriend,
			inviteMultipleFriends: inviteMultipleFriends
		};

		return service;

		function acceptFriend(id) {
			return $http.post(ServerUrl + 'friendship/respond/' + id);
		}

		function getNonFriend(id) {
			return $http.get(ServerUrl + 'user/non-friend/' + id);
		}

		function denyFriend(id) {
			return $http.delete(ServerUrl + 'friendship/respond/' + id);
		}

		function inviteFriend(id) {
			return $http.post(ServerUrl + 'friendship/invite/', { inviteeId: id });
		}

		function inviteMultipleFriends(ids) {
			return $http.post(ServerUrl + 'friendship/invite/bulk', ids);
		}
	}
})();
