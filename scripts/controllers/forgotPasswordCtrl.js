(function() {
	angular.module('jurnie').controller('ForgotPasswordController', forgotPasswordCtrl);

	function forgotPasswordCtrl(User, SweetAlert) {
		var vm = this;

		vm.email = null;
		vm.displayCheckEmailMsg = false;

		vm.sendEmail = sendEmail;

		function sendEmail() {
			User.forgotPassword(vm.email).then(
				function(data) {
					vm.displayCheckEmailMsg = true;
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
	}
})();
