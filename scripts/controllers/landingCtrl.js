(function() {
	angular.module('jurnie').controller('LandingController', landingCtrl);

	function landingCtrl(Auth, $stateParams, facebookService, $state, instagramService, httpService) {
		var vm = this;

		vm.firstName = null;
		vm.lastName = null;
		vm.password = null;
		vm.email = null;
		vm.gender = null;
		vm.birthday = getTodayDate();
		vm.landingBirthday = null;
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

		function getTodayDate() {
		    var today = new Date();
		    var dd = today.getDate();
		    var mm = today.getMonth() + 1;
		    var yyyy = today.getFullYear();
		    if (dd < 10) {
		        dd = '0' + dd;
		    }
		    if (mm < 10) {
		        mm = '0' + mm;
		    }
		    today = yyyy + '-' + mm + '-' + dd;
		    return today;
		}
		function birthDateFormatted() {
		    vm.birthday = GetDateFormat(vm.landingBirthday);
		    console.log("birthday", vm.birthday);
		}
		function GetDateFormat(inputDate) {
		    var date = new Date(inputDate); 
		    var month = (date.getMonth() + 1).toString();
		    month = month.length > 1 ? month : '0' + month;
		    var day = date.getDate().toString();
		    day = day.length > 1 ? day : '0' + day;
		    return date.getFullYear() + '-' + month + '-' + day;
		}

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
		                if (response.status == 0 && response.message == 'User already registered ') {
                            alert("You are already registered. Please login. ")
		                }
		                else if (response.status == 200) {
		                    httpService.socialLogin(fbObject).then(function (response) {
		                        Auth.getMe().then(function (response) {
		                            if (response) {
		                                $state.go('app.dashboard');
		                            }
		                        });

		                    });
		                   
		                }
		                
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
		                "first_name": response.data.full_name,
		                "last_name": response.last_name
		            }

		            httpService.socialSignup(fbObject).then(function (response) {
		                if (response.status == 0 && response.message == 'User already registered ') {
		                    alert("You are already registered. Please login. ")
		                }
		                else if (response.status == 200) {
		                    httpService.socialLogin(fbObject).then(function (response) {

		                        Auth.getMe().then(function (response) {
		                            if (response) {
		                                $state.go('app.dashboard');
		                            }
		                        });

		                    });

		                }


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
		                if (response.status == 0 && response.message == 'User already registered ') {
		                    alert("You are already registered. Please login. ")
		                }
		                else if (response.status == 200) {
		                    httpService.socialLogin(fbObject).then(function (response) {
		                        setTimeout(function () {
		                            Auth.getMe().then(function (response) {
		                                if (response) {
		                                    $state.go('app.home');
		                                }
		                            });
		                        }, 5000);

		                       

		                    });

		                }

		            });
		        }
		        else {
		            alert("Something went wrong. Please try again after some time.")
		        }
		    });

		}
	}
})();
