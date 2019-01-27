(function() {
	angular.module('jurnie').controller('SignupController', signupCtrl);

	function signupCtrl(
		Auth,
		$state,
		ModalService,
		$stateParams,
		Country,
		travellerTypes,
		emailInvite,
		toastr,
		fbInvite,
		SweetAlert
	) {
		var vm = this;

		//local variables
		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		var afterTomorrow = new Date();
		afterTomorrow.setDate(tomorrow.getDate() + 1);

		if (emailInvite) {
			toastr.success(
				'In order to see ' + emailInvite.inviter.firstName + "'s profile, you'll have to create an account"
			);
		}
		if (fbInvite) {
			toastr.success(
				'In order to see ' + fbInvite.inviter.firstName + "'s profile, you'll have to create an account"
			);
		}

		//bound methods
		vm.signup = signup;
		vm.addProfilePic = addProfilePic;
		vm.goToAddFriends = goToAddFriends;
		vm.updateProfilePic = updateProfilePic;
		vm.open1 = open1;
		vm.open2 = open2;
		vm.updateProfilePic = updateProfilePic;

		//bound values
		vm.emailInvite = emailInvite;
		vm.travelerTypes = [{ id: '?', description: 'Traveller Type' }].concat(travellerTypes);
		vm.countries = Country.staticList;
		var formattedDate = new Date($stateParams.bday);
		
		vm.user = {
			firstName: $stateParams.firstName || null,
			lastName: $stateParams.lastName || null,
			email: $stateParams.email || null,
			birthday: formattedDate || null,
			password: $stateParams.password || null,
			gender: $stateParams.gender || null,
			nationality: 'Nationality',
			travelerType: null,
			travelerTypeId: '?',
			profilePic: 'assets/Annonymous.png',
			favorite: null,
			emailInviteId: emailInvite ? emailInvite.id : null,
			fbInviteId: fbInvite ? fbInvite.id : null,
			recaptchaResponse: null
		};

		vm.inlineOptions = {
			customClass: getDayClass,
			maxDate: new Date(),
			showWeeks: false
		};

		vm.dateOptions = {
			formatYear: 'yyyy',
			maxDate: new Date(),
			startingDay: 1,
			showWeeks: false
		};

		vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		vm.format = vm.formats[0];
		vm.altInputFormats = ['M!/d!/yyyy'];

		vm.popup1 = {
			opened: false
		};

		vm.popup2 = {
			opened: false
		};

		vm.events = [
			{
				date: tomorrow,
				status: 'full'
			},
			{
				date: afterTomorrow,
				status: 'partially'
			}
		];

		//function implementations

		function signup() {
			var newUser = angular.clone(vm.user);
			if (newUser.userTypeId === '?') delete newUser.userTypeId;
			Auth.signup(newUser).then(function(response) {
				Auth.getMe().then(function() {
					$state.go('app.dashboard');
				});
			});
		}

		function updateProfilePic(data) {
			vm.user.profilePic = data;
		}

		function addProfilePic() {}

		function goToAddFriends() {
			if (
				!vm.user.firstName ||
				!vm.user.lastName ||
				!vm.user.email ||
				!vm.user.birthday ||
				!vm.user.password ||
				!vm.user.gender
			) {
				SweetAlert.swal(
					{
						title: 'Something went wrong...',
						text: "Fields with a '*' are required!",
						confirmButtonColor: '#00A99D',
						confirmButtonText: 'OK',
						type: 'warning'
					},
					function(isConfirm) {}
				);
			} else {
				Auth.signup(vm.user).then(
					function() {
						$state.go('app.add_friends');
					},
					function(err) {
						console.error(err);
					}
				);
			}
		}

		function open1() {
			vm.popup1.opened = true;
		}

		function open2() {
			vm.popup2.opened = true;
		}

		function getDayClass(data) {
			var date = data.date, mode = data.mode;
			if (mode === 'day') {
				var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

				for (var i = 0; i < vm.events.length; i++) {
					var currentDay = new Date(vm.events[i].date).setHours(0, 0, 0, 0);

					if (dayToCheck === currentDay) {
						return vm.events[i].status;
					}
				}
			}

			return '';
		}
	}
})();
