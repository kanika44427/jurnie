(function() {
	angular.module('jurnie').controller('NewPinController', newPinCtrl);

	function newPinCtrl(
		Auth,
		$timeout,
		$rootScope,
		$uibModalInstance,
		Pin,
		pinToEdit,
		coords,
		SweetAlert,
		Search,
		nearby,
		$scope
	) {
		var vm = this;

		vm.randomCity = 'Melbourne, Australia';
		vm.choice = false;
		vm.whichPin = null;
		vm.editing = false;
		vm.from = true;
		vm.dateFrom = pinToEdit ? pinToEdit.startDate : getTodayDate();
		vm.dateTo = pinToEdit ? pinToEdit.endDate : getTodayDate();
		vm.lat = coords ? coords.latitude : pinToEdit ? pinToEdit.latitude : null;
		vm.long = coords ? coords.longitude : pinToEdit ? pinToEdit.longitude : null;
		vm.rating = 3;
		vm.placeName = null;
		vm.custom = false;
		vm.places = nearby;
		vm.gotFriendsPins = false;
		vm.friendsNearby = null;

		vm.dateOptionsTo = {
			formatYear: 'yyyy',
			maxDate: null,
			minDate: vm.dateFrom,
			startingDay: 1,
			showWeeks: false
		};
		//vm.dateOptionsFrom = {
		//	formatYear: 'yyyy',
		//	maxDate: null,
		//	minDate: null,
		//	startingDay: 1,
		//	showWeeks: false
		//};
		
		$scope.$watch(
			function() {
				return vm.dateOptionsTo.minDate;
			},
			function(newVal, oldVal) {
				vm.dateTo = newVal;
			}
		);

		$("#fromDate").datepicker("setDate", new Date());

		$("#toDate").datepicker("setDate", new Date());

		vm.pin = {
			pinTypeId: null,
			latitude: vm.lat,
			longitude: vm.long,
			startDate: vm.dateFrom,
			endDate: vm.dateTo,
			rating: vm.rating,
			note: null,
			description: null
		};

		vm.submit = submit;
		vm.deletePin = deletePin;
		vm.updatePin = updatePin;
		vm.cancel = cancel;
		vm.choosePlace = choosePlace;
		vm.makeCustom = makeCustom;

		if (pinToEdit) {
			vm.editing = true;
			vm.pin = pinToEdit;
		}

		init();
		
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
		    today = mm + '-' + dd + '-' + yyyy;
		    return today;
		}
		function init() {
		   
			Pin.getNearbyFriendPins(vm.lat, vm.long).then(
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

		function choosePlace(place) {
			vm.placeName = place.description;
			vm.pin.description = vm.placeName;
		}

		function makeCustom() {
			vm.custom = !vm.custom;
			vm.placeName = null;
		}

		function submit() {
		    vm.pin.description = vm.placeName;
           
		    vm.pin.startDate = new Date(vm.dateOptionsTo.minDate);
			vm.pin.endDate = new Date(vm.dateTo);
			Pin.add(vm.pin).then(
				function() {
					$uibModalInstance.dismiss('cancel');
				},
				function(err) {
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

		function cancel() {
			$rootScope.$emit('cancel');
			$uibModalInstance.dismiss('cancel');
		}

		function deletePin() {
			Pin.remove(pinToEdit.id).then(function(response) {
				$uibModalInstance.dismiss('cancel');
			});
		}

		function updatePin() {
			vm.pin.startDate = vm.dateFrom;
			vm.pin.endDate = vm.dateTo;
			Pin.updatePin(vm.pin.id, vm.pin).then(function(response) {
				$uibModalInstance.dismiss('cancel');
			});
		}

		$rootScope.$on('newPin', function(event, latLng) {
			vm.pin.latitude = latLng.lat();
			vm.pin.longitude = latLng.lng();
		});
	}
})();
