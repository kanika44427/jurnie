(function() {
	angular.module('jurnie').controller('HomeController', homeCtrl);

	function homeCtrl(Auth, $timeout, City, $rootScope, Pin, $stateParams, $scope) {
		var vm = this;

		vm.changeChoice = changeChoice;
		vm.skip = skip;
		vm.savePin = savePin;
		vm.savePinMobile = savePinMobile;
		vm.open1 = open1;
		vm.open2 = open2;
		vm.screenChange = screenChange;
		vm.feedOpen = false;
		vm.submitting = false;
		vm.gotFriendsPins = false;

		vm.randomCity = null;
		vm.mapChosen = true;
		vm.choice = false;
		vm.whichPin = null;
		vm.dateFrom = new Date();
		vm.dateTo = new Date();
		vm.to = false;
		vm.from = true;
		vm.rating = 3;
		vm.popup1 = {
			opened: false
		};

		vm.popup2 = {
			opened: false
		};

		vm.dateOptionsTo = {
			formatYear: 'yyyy',
			maxDate: null,
			minDate: vm.dateFrom,
			startingDay: 1,
			showWeeks: false
		};
		vm.dateOptionsFrom = {
			formatYear: 'yyyy',
			maxDate: null,
			minDate: null,
			startingDay: 1,
			showWeeks: false
		};

		$scope.$watch(
			function() {
				return vm.dateOptionsTo.minDate;
			},
			function(newVal, oldVal) {
				vm.dateTo = newVal;
			}
		);

		if ($stateParams.lat && $stateParams.long) {
			vm.lat = $stateParams.lat;
			vm.long = $stateParams.long;
		}

		$rootScope.$watch(
			function() {
				return City.currCity;
			},
			function(event, options) {
				vm.randomCity = City.currCity;
				vm.whichPin = null;
				vm.choice = false;
				vm.dateFrom = new Date();
				vm.dateTo = new Date();
				vm.to = false;
				vm.from = true;
				vm.rating = 3;
				vm.pin.latitude = City.currCity ? City.currCity.latitude : null;
				vm.pin.longitude = City.currCity ? City.currCity.longitude : null;
				if (vm.randomCity && vm.randomCity.latitude) {
					nearbyFriends(vm.randomCity.latitude, vm.randomCity.longitude);
				}
			}
		);

		vm.options = {
			showWeeks: false
		};

		vm.pin = {
			pinTypeId: null,
			latitude: null,
			longitude: null,
			startDate: vm.dateFrom,
			endDate: vm.dateTo,
			rating: vm.rating,
			note: null
		};

		function changeChoice(choice) {
			$timeout(function() {
				vm.choice = choice;
			});
		}

		function skip() {
			vm.gotFriendsPins = false;
			City.get();
			nearbyFriends(City.currCity.latitude, City.currCity.longitude);
			// MOVES TO NEXT RANDOM CITY
		}

		function nearbyFriends(lat, long) {
			Pin.getNearbyFriendPins(lat, long).then(
				function(response) {
					var userIds = {};
					var firstFive = [];
					response.data.forEach(function(friendPin) {
						if (firstFive.length < 5 && !userIds[friendPin.user.id]) {
							firstFive.push(friendPin);
							userIds[friendPin.user.id] = true;
						}
					});
					vm.friendsNearby = firstFive;
					vm.gotFriendsPins = true;
					console.log('friends nearby', vm.friendsNearby);
				},
				function(err) {
					console.log('nearby friend pins error:', err);
				}
			);
		}

		function savePin() {
			if (vm.submitting) {
				return;
			}
			if (vm.whichPin === 'been') {
				vm.pin.pinTypeId = 1;
			} else if (vm.whichPin === 'going') {
				vm.pin.pinTypeId = 2;
			} else {
				vm.pin.pinTypeId = 3;
			}
			var isRand = true;
			vm.pin.latitude = City.currCity.latitude;
			vm.pin.longitude = City.currCity.longitude;
			vm.pin.startDate = vm.dateOptionsTo.minDate;
			vm.pin.endDate = vm.dateTo;
			vm.submitting = true;
			Pin.add(vm.pin, isRand).then(
				function() {
					vm.pin.note = null;
					vm.submitting = false;
				},
				function(err) {
					vm.submitting = false;
				}
			);
		}

		function savePinMobile() {
			if (vm.submitting) {
				return;
			}
			if (vm.whichPin === 'been') {
				vm.pin.pinTypeId = 1;
			} else if (vm.whichPin === 'going') {
				vm.pin.pinTypeId = 2;
			} else {
				vm.pin.pinTypeId = 3;
			}
			vm.pin.latitude = City.currCity.latitude;
			vm.pin.longitude = City.currCity.longitude;
			vm.pin.startDate = vm.dateFrom;
			vm.pin.endDate = vm.dateTo;
			vm.submitting = true;
			Pin.add(vm.pin).then(
				function() {
					vm.pin.note = null;
					vm.submitting = false;
				},
				function(err) {
					vm.submitting = false;
				}
			);
			vm.mapChosen = true;
		}

		function open1() {
			vm.popup1.opened = true;
		}

		function open2() {
			vm.popup2.opened = true;
		}

		function screenChange(screen) {
			if (screen === 'map') {
				vm.mapChosen = true;
			} else {
				vm.mapChosen = false;
			}
		}

		$rootScope.$on('feed', function(event, feed) {
			if (!feed) {
				vm.feedOpen = true;
			} else {
				vm.feedOpen = false;
			}
		});
	}
})();
