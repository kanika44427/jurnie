(function() {
	angular.module('jurnie').factory('User', user);

	function user(ServerUrl, $http, Auth, $rootScope) {
		var service = {
			grab: grab,
			update: update,
			deleteAccount: deleteAccount,
			forgotPassword: forgotPassword,
			resetPassword: resetPassword,
			getStats: getStats
		};
		return service;

		function grab(id) {
			return $http.get(ServerUrl + 'user/' + id);
		}

		function update(user) {
			return $http.put(ServerUrl + 'user/' + user.id, user).then(function(response) {
				Auth.user = response.data;
				return response;
			});
		}

		function deleteAccount(id) {
			return $http.delete(ServerUrl + 'user/' + id).then(function(response) {
				$rootScope.$emit('logout');
				return response;
			});
		}

		function forgotPassword(email) {
			return $http.post(ServerUrl + 'user/forgot-pw', { email: email });
		}

		function resetPassword(email, pw, code) {
			return $http.post(ServerUrl + 'user/reset-pw', { email: email, password: pw, code: code });
		}

		function getStats(startTime, endTime) {
			if ((startTime, endTime)) {
				return $http.get(ServerUrl + 'stats?startDate=' + startTime + '&endDate=' + endTime);
			} else {
				return $http.get(ServerUrl + 'stats');
			}
		}
	}
})();
