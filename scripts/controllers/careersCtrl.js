(function() {
	angular.module('jurnie').controller('CareersController', careersCtrl);

	function careersCtrl(Auth, Career, SweetAlert) {
		var vm = this;

		vm.application = {
			name: null,
			location: null,
			email: null,
			phone: null,
			notes: null,
			resume: null
		};
		vm.posted = false;

		vm.submitApplication = submitApplication;
		vm.onResumeUpload = onResumeUpload;

		function submitApplication() {
			Career.postInquiry(vm.application).then(
				function() {
					vm.application = {
						name: null,
						location: null,
						email: null,
						phone: null,
						notes: null
					};
					vm.posted = true;
				},
				function(err) {
					console.error('career failure', err);
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

		function onResumeUpload(data) {
			// console.log(data);
		}
	}
})();
