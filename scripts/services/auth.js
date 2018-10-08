(function() {
	angular.module('jurnie').factory('Auth', auth);

	function auth($http, ServerUrl, $q, SweetAlert, $state, $rootScope, $localStorage) {
		var service = {
			loggedIn: $q.defer(),
			getMe: getMe,
			user: null,
			login: login,
			logout: logout,
			signup: signup,
			payload: null,
			deleteUser: deleteUser
		};

		$rootScope.$on('logout', function() {
			logout();
		});

		$rootScope.$on('login', function() {
			getMe();
		});

		init();

		function init() {
			tryUpdateUserInfo();
			if (service.payload) {
				getMe();
			}
		}

		return service;

		function login(email, pw) {
			var payload = {
				email: email,
				password: pw
			};
			return $http.post(ServerUrl + 'user/login', payload).then(
				function(response) {
					$localStorage.token = response.data.token;
					tryUpdateUserInfo();
					$rootScope.$emit('login');
					return response;
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
					return false;
				}
			);
		}

		function signup(user) {
			return $http.post(ServerUrl + 'user/signup', user).then(
				function(response) {
					$localStorage.token = response.data.token;
					tryUpdateUserInfo();
					$rootScope.$emit('login');
					return response;
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

		function getMe() {
			service.loggedIn = $q.defer();
			return $http.get(ServerUrl + 'user/me').then(
				function(response) {
					service.loggedIn.resolve(response.data);
					service.user = response.data;
					return response;
				},
				function(response) {
					service.loggedIn.reject();
					service.user = null;
					return response;
				}
			);
		}

		function logout() {
			$localStorage.token = null;
			service.user = null;
			service.payload = null;
			$state.go('app.landing');
		}

		function tryUpdateUserInfo() {
			if ($localStorage.token) {
				service.payload = getClaimsFromToken();
				if (!service.payload) {
					$localStorage.token = null;
					$state.go('app.landing');
				}
			} else {
				service.payload = null;
				$state.go('app.landing');
			}
		}

		function urlBase64Decode(str) {
			var output = str.replace('-', '+').replace('_', '/');
			switch (output.length % 4) {
				case 0:
					break;
				case 2:
					output += '==';
					break;
				case 3:
					output += '=';
					break;
				default:
					throw 'Illegal base64url string!';
			}
			return window.atob(output);
		}
		// call this on app load
		function getClaimsFromToken() {
			var token = $localStorage.token;
			if (token) {
				var encodedClaims = token.split('.')[1];
				var claims = JSON.parse(urlBase64Decode(encodedClaims));
			}
			return claims;
		}

		function deleteUser(id) {
			return $http.delete(ServerUrl + 'user/' + id).then(function(response) {
				return response;
			});
		}
	}
})();
