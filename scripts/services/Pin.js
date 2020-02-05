(function() {
	angular.module('jurnie').factory('Pin', pin);

	function pin($http, ServerUrl, $q, SweetAlert, $state, $rootScope, $localStorage, City, $timeout) {
		var service = {
			getFriendPins: getFriendPins,
			list: list,
			add: add,
			getOnePin: getOnePin,
			remove: remove,
			updatePin: updatePin,
			getNearbyFriendPins: getNearbyFriendPins
		};

		var pinList = [];
		var canReqPinList = true;

		return service;

		function list(changed) {
			return new Promise(function(resolve, reject) {
				if (!canReqPinList && !changed) return resolve({ data: pinList });

				$http.get(ServerUrl + 'pin').then(
					function(response) {
						lastPinList = Date.now();
						pinList = response.data;
						// console.log('pinList:', pinList);
						canReqPinList = false;
						if (!changed) {
							$timeout(function() {
								canReqPinList = true;
							}, 1000 * 10);
						}
						resolve(response);
					},
					function(err) {
						reject(err);
					}
				);
			});
		}

		function getOnePin(id) {
			return $http.get(ServerUrl + 'pin/' + id);
		}

		function updatePin(id, pin) {
			return $http.put(ServerUrl + 'pin/' + id, pin).then(
				function(response) {
					$rootScope.$emit('reload_map', { latitude: pin.latitude, longitude: pin.longitude, newPin: true });
				},
				function(err) {
					console.log(err);
				}
			);
		}

		function getFriendPins(friendId) {
			return $http.get(ServerUrl + 'pin?userId=' + friendId);
		}

		function add(pin , instaPin) {
			return $http.post(ServerUrl + 'pin', pin).then(function(response) {
				// if (isRand) {
				// 	City.get();
				// } else {
				pin.changed = true;
				$rootScope.$emit('reload_map', pin);
				// }
				return response;
			}, err => {
			//console.log(err);
			if(err.message == 'You already have a pin at this location!' && instaPin){
                 var imageObj = {
		                "userId": res.data.userId,
		                "pinId": res.data.id,
		                "image": taggedInfo.images.thumbnail.url
			    }
			    httpService.updateInstaImage(imageObj).then(function (res) {
			        console.log("photo upload succesfully", imageObj.pinId);
			    });
			}
			});
		}

		function remove(id) {
			return $http.delete(ServerUrl + 'pin/' + id).then(
				function(response) {
					$rootScope.$emit('reload_map', {
						longitude: response.data.longitude,
						latitude: response.data.latitude,
						changed: true
					});
					return response;
				},
				function(err) {
					console.log(err);
				}
			);
		}

		function getNearbyFriendPins(lat, long) {
			return $http.get(ServerUrl + 'pin/nearby?latitude=' + lat + '&longitude=' + long).then(function(response) {
				return response;
			});
		}
	}
})();
