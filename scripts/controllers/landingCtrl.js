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
		vm.birthDateFormatted = birthDateFormatted;

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
		                "first_name": response.first_name,
		                "last_name": response.last_name,
		                "profile_image" : response.picture ? response.picture.data.url : '',
		                "social_user_name": response.email,
		                "userSocialType": "facebook",
		                "provider_id": response.id
		            }
		            httpService.socialSignup(fbObject).then(function (response) {
		                if (response.data.message == "User already registered" && response.data.status == 0) {
		                    httpService.socialLogin(fbObject).then(function (response) {
		                        facebookService.getFeedData().then(function (response) {
		                            if (response.tagged_places && response.tagged_places.data && response.tagged_places.data.length > 0) {
		                                var tagged_places = response.tagged_places.data;
		                                console.log("tagged places", tagged_places);
		                                for (var i = 0; i < tagged_places.length ; i++) {
		                                    createFBMarker(tagged_places[i]);
		                                    if (i == (tagged_places.length - 1)) {
		                                        Auth.getMe().then(function (response) {
		                                            if (response) {
		                                                $state.go('app.home');
		                                            }
		                                        });
		                                    }
		                                }
		                            }
		                            else {
		                                Auth.getMe().then(function (response) {
		                                    if (response) {
		                                        $state.go('app.home');
		                                    }
		                                });
		                            }
		                        });
		                    });
		                }
		                else if (response.data.message == "Thank you for registration using facebook" && response.data.status == 1) {
		                    httpService.socialLogin(fbObject).then(function (response) {
		                        //register tagged places in jurnie account 
		                        facebookService.getFeedData().then(function (response) {
		                                if (response.tagged_places && response.tagged_places.data && response.tagged_places.data.length > 0 ) {
		                                    var tagged_places = response.tagged_places.data;
		                                    console.log("tagged places", tagged_places);
		                                    for (var i = 0; i < tagged_places.length ; i++){
		                                        createFBMarker(tagged_places[i]);
		                                        if (i == (tagged_places.length -1)) {
		                                            Auth.getMe().then(function (response) {
		                                                if (response) {
		                                                    $state.go('app.home');
		                                                }
		                                            });
		                                        }
		                                    }
		                                }
		                                else {
		                                    Auth.getMe().then(function (response) {
		                                        if (response) {
		                                            $state.go('app.home');
		                                        }
		                                    });
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

		function createFBMarker(taggedInfo) {
		    var req_obj = {
		        "pinTypeId": 3,
		        "latitude": taggedInfo.place.location.latitude,
		        "longitude": taggedInfo.place.location.longitude,
		        "startDate": taggedInfo.created_time,
		        "endDate": taggedInfo.created_time,
		        "rating": -1,
		        "note": "",
		        "description": null
		    }
		    Pin.add(req_obj).then(function () {
                console.log("fb pin created")
		    });
		}

		vm.signUpWithInstagram = function () {
		    instagramService.authorize();
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
