(function() {
	angular.module('jurnie').controller('LandingController', landingCtrl);

	function landingCtrl(Auth, $stateParams, facebookService, $state, instagramService) {
		var vm = this;

		vm.firstName = null;
		vm.lastName = null;
		vm.password = null;
		vm.email = null;
		vm.gender = null;
		vm.birthday = new Date();
		vm.noBday = true;

		vm.inlineOptions = {
			customClass: getDayClass,
			minDate: null,
			showWeeks: true
		};

		vm.dateOptions = {
			formatYear: 'yyyy',
			maxDate: new Date(2020, 5, 22),
			minDate: null,
			startingDay: 1,
			showWeeks: false
		};

		vm.open1 = function() {
			vm.popup1.opened = true;
		};

		vm.signUpWithFacebook = function () {
		    facebookService.login().then(function (response) {
		        console.log(response);
		        if (response && response.id) {
		            var fbObject = {
		                "email": response.email,
		                "first_name": response.first_name,
		                "last_name": response.last_name,
		                "user_type": "facebook",
		                "provider_id": response.id,
		                //"profile_image" : 
		            }
		            httpService.socialSignup(fbObject).then(function (response) {
		                $state.go('app.about');
		            });
		        }
		        else {
		            alert("Something went wrong. Please try again after some time.")
		        }
		    });

		}
		vm.signUpWithInstagram = function () {
		    instagramService.login().then(function (response) {
		        console.log(response);
		        if (response.data && response.status == 200) {
		            var fbObject = {
		                "email": response.data.username,
		                "user_type": "instagram",
		                "provider_id": response.data.id,
		                "first_name": response.data.full_name
		            }
		            httpService.socialLogin(fbObject).then(function (response) {
		                $state.go('app.about');
		            });
		        }
		    });
		}
		vm.open2 = function() {
			vm.popup2.opened = true;
			vm.noBday = false;
		};

		// vm.setDate = function(year, month, day) {
		//     vm.birthday = new Date(year, month, day);
		// };

		vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		vm.format = vm.formats[0];
		vm.altInputFormats = ['M!/d!/yyyy'];

		vm.popup1 = {
			opened: false
		};

		vm.popup2 = {
			opened: false
		};

		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		var afterTomorrow = new Date();
		afterTomorrow.setDate(tomorrow.getDate() + 1);
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
