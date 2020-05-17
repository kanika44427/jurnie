(function() {
	angular.module('jurnie').controller('SettingsController', settingsCtrl);

	function settingsCtrl(Auth, $uibModal, $uibModalInstance, SweetAlert, Country, TravellerType, User, $state) {
		var vm = this;

		TravellerType.list().then(function(response) {
			vm.travellerTypes = response.data;
		});

		vm.close = close;
		vm.deleteAccount = deleteAccount;
		vm.updateProfilePic = updateProfilePic;
		vm.save = save;
		vm.open1 = open1;
		vm.open2 = open2;
		vm.edit = edit;
		vm.birthDateFormatted = birthDateFormatted;
		vm.user = angular.copy(Auth.user);
		vm.user.birthday = new Date(vm.user.birthday);
		vm.countries = Country.staticList;
		vm.editing = null;
		vm.popup1 = {
			opened: false
		};
		vm.popup2 = {
			opened: false
		};
		vm.dateOptions = {
			formatYear: 'yyyy',
			maxDate: new Date(),
			startingDay: 1,
			showWeeks: false
		};

		function birthDateFormatted() {

		   vm.user.birthday = GetDateFormat(vm.user.birthday);
		    
		}

		function GetDateFormat(inputDate) {
		    var date = new Date(inputDate);
		    var month = (date.getMonth() + 1).toString();
		    month = month.length > 1 ? month : '0' + month;
		    var day = date.getDate().toString();
		    day = day.length > 1 ? day : '0' + day;
		    return date.getFullYear() + '-' + month + '-' + day;
		}


		function save() {
		    var user = {
		        id: vm.user.id,
		        firstName: vm.user.firstName,
		        gender: vm.user.gender,
		        lastName: vm.user.lastName,
		        userTypeId: vm.user.userTypeId,
		        profilePic: vm.user.profilePic,
		        email: vm.user.email,
		        nationality: vm.user.nationality,
		        travellerTypeId: vm.user.travellerTypeId
                
		    }
			User.update(user).then(
				function(response) {
					$uibModalInstance.dismiss('cancel');
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

		function edit(type) {
			vm.editing = type;
		}

		function open1() {
			vm.popup1.opened = true;
		}

		function open2() {
			vm.popup2.opened = true;
		}

		function close() {
			$uibModalInstance.dismiss('cancel');
		}

		function updateProfilePic(url) {
			vm.user.profilePic = url;
		}

		function deleteAccount(id) {
			SweetAlert.swal(
				{
					title: 'Delete your Account?',
					text: "You'll lose all your pins, notes, and friends!  Are you sure?",
					confirmButtonColor: '#D8D9DA',
					confirmButtonText: 'Yes, delete everything',
					showCancelButton: true,
					cancelButtonText: 'No!',
					type: 'warning'
				},
				function(isConfirm) {
					if (isConfirm) {
						User.deleteAccount(id).then(function() {
							close();
							$state.go('app.landing');
						});
					}
				}
			);
		}
	}
})();
