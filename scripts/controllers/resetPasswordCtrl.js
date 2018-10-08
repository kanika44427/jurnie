(function() {
	angular.module('jurnie').controller('ResetPasswordController', resetPasswordCtrl);

	function resetPasswordCtrl(User, SweetAlert, $state, code) {
		var vm = this;

		vm.email = null;

		vm.resetPassword = resetPassword;

		function resetPassword() {
			if (vm.password && vm.confirmPassword && vm.email && vm.password === vm.confirmPassword) {
				User.resetPassword(vm.email, vm.password, code).then(
					function(data) {
						SweetAlert.swal(
							{
								title: 'Password Changed!',
								confirmButtonColor: '#00A99D',
								confirmButtonText: 'OK',
								type: 'success'
							},
							function(isConfirm) {
								$state.go('app.landing');
							}
						);
					},
					function(err) {
						console.error(err);
						SweetAlert.swal(
							{
								title: 'Something went wrong...',
								text:
									err.data && err.data.message ? 'Message: ' + err.data.message : 'Sorry about that!',
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
	}
})();
