(function() {
	angular.module('jurnie').controller('LoginController', loginCtrl);

	function loginCtrl(Auth, $state, ModalService) {
		var vm = this;

		vm.login = login;

		vm.email = '';
		vm.password = '';
		vm.verifyPassword = '';

		function login() {
			Auth.login(vm.email, vm.password).then(function(response) {
				Auth.getMe().then(function(response) {
					if (response) {
						$state.go('app.dashboard');
					}
				});
			});
		}
	}
})();
