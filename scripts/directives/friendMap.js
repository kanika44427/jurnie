(function() {
	'use strict';
	angular.module('jurnie').controller('FriendMapsCtrl', mapsCtrl).directive('friendmap', friendmap);

	function mapsCtrl(Pin, $scope, $rootScope, $stateParams, SweetAlert) {
		var vm = this;

		vm.notes = false;
		vm.friends = true;
		vm.records = Pin.pins;
		vm.animationsEnabled = true;

		vm.deletePin = deletePin;
		vm.makeNewPin = makeNewPin;
		vm.open = open;
		vm.init = init;

		$scope.$watch(
			() => vm.friendId,
			() =>
				init(() => {
					const options = {
						longitude: $stateParams.longitude,
						latitude: $stateParams.latitude
					};
					$rootScope.$emit('reload_friendmap', options);
				})
		);

		vm.init(() => {
			const options = {
				longitude: $stateParams.longitude,
				latitude: $stateParams.latitude
			};
			$rootScope.$emit('reload_friendmap', options);
		});

		function init(cb) {
			if (vm.friendId) {
				Pin.getFriendPins(vm.friendId).then(function(response) {
					vm.records = response.data;
					cb(response.data);
				});
			}
		}

		function deletePin(id) {
			Pin.remove(id).then(function(response) {
				// console.log('deleted!', response);
			});
		}

		function makeNewPin(latLng) {
			vm.open();
		}

		function open() {
			var modalInstance = $uibModal.open({
				animation: vm.animationsEnabled,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: '../templates/newPinModal.html',
				controller: 'NewPinController',
				controllerAs: 'newPin',
				windowClass: 'large-Modal',
				size: 'lg'
			});
		}
	}

	function friendmap(Pin, $localStorage, $compile, $window, $filter, $rootScope, $stateParams) {
		return {
			restrict: 'E',
			replace: true,
			template: '<div id="map"></div>',
			scope: {
				choice: '=',
				changeChoice: '&',
				onMarkerClick: '&',
				friendId: '<'
			},
			controller: 'FriendMapsCtrl',
			controllerAs: 'maps',
			bindToController: true,
			link: linkFn
		};

		function linkFn(scope, elem, attrs, maps, $window) {
			var map = new google.maps.Map(elem[0]);
			var infoWindow = null;
			var records = Pin.pins;

			$rootScope.$on('reload_friendmap', function(event, options) {
				if (options.longitude && options.latitude) {
					showPosition(options);
				} else if (maps.records.length) {
					showPosition({
						longitude: maps.records[0].longitude,
						latitude: maps.records[0].latitude
					});
				} else if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						showPosition({
							longitude: position.coords.longitude,
							latitude: position.coords.latitude
						});
					});
				}
			});

			// scope.$watch(() => maps.records, () => {});
			Pin.getFriendPins(maps.friendId).then(
				function(markers) {
					if (maps.records && maps.records.length) {
						showPosition({
							longitude: maps.records[0].longitude,
							latitude: maps.records[0].latitude
						});
					} else if (markers.data && markers.data.length) {
						showPosition({
							longitude: markers.data[0].longitude,
							latitude: markers.data[0].latitude
						});
					} else if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(function(position) {
							showPosition({
								longitude: position.coords.longitude,
								latitude: position.coords.latitude
							});
						});
					}
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

			function showPosition(position) {
				var mapOptions = {
					center: getGoogleLatLong(position),
					zoom: 8,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					disableDefaultUI: true,
					scrollwheel: true,
					zoomControl: false,
					zoomControlOptions: {
						position: google.maps.ControlPosition.RIGHT_CENTER
					},
					disableDoubleClickZoom: true
				};

				map = new google.maps.Map(document.getElementById('map'), mapOptions);

				loadMarkers();

				google.maps.event.addListener(map, 'click', function() {
					maps.onMarkerClick({
						choice: false
					});
					if (infoWindow !== null) {
						infoWindow.close();
					}
				});
			}

			function getGoogleLatLong(coords) {
				return new google.maps.LatLng(
					$stateParams.latitude || coords.latitude,
					$stateParams.longitude || coords.longitude
				);
			}

			function loadMarkers() {
				Pin.getFriendPins(maps.friendId).then(function(pins) {
					var records = pins.data;
					var markers = [];

					for (var i = 0; i < records.length; i++) {
						var record = records[i];
						for (var k = 0; k < record.nearbyPins.length; k++) {
							record.nearbyPins[k];
							if (record.nearbyPins[k].pinTypeId === 1) {
								record.nearbyPins[k].pinPic = 'assets/Blue Pin - Small.png';
							} else if (record.nearbyPins[k].pinTypeId === 2) {
								record.nearbyPins[k].pinPic = 'assets/Green Pin - Small.png';
							} else {
								record.nearbyPins[k].pinPic = 'assets/Orange Pin - Small.png';
							}
						}
						if (record.pinTypeId === 1) {
							record.pinPic = 'assets/Blue Pin - Small.png';
							record.pinMessage = 'Been Here';
						} else if (record.pinTypeId === 2) {
							record.pinPic = 'assets/Green Pin - Small.png';
							record.pinMessage = 'Going Here';
						} else {
							record.pinPic = 'assets/Orange Pin - Small.png';
							record.pinMessage = 'Wish List';
						}
						var markerPos = new google.maps.LatLng(record.latitude, record.longitude);

						// Add the markerto the map
						var image = {
							url: record.pinPic,
							// This marker is 20 pixels wide by 32 pixels high.
							scaledSize: new google.maps.Size(18, 25),
							// The origin for this image is (0, 0).
							origin: new google.maps.Point(0, 0),
							// The anchor for this image is the base of the flagpole at (0, 32).
							anchor: new google.maps.Point(0, 32)
						};

						var shape = {
							coords: [1, 1, 1, 20, 18, 20, 18, 1],
							type: 'poly'
						};

						var marker = new google.maps.Marker({
							map: map,
							animation: google.maps.Animation.DROP,
							position: markerPos,
							shape: shape,
							icon: image
						});

						markers.push(marker);

						var cityName = record.city;
						var countryCode = record.countryCode;
						var startDate = $filter('date')(record.startDate, 'd-M-yyyy');
						var endDate = $filter('date')(record.endDate, 'd-M-yyyy');
						var rating = record.rating;
						var pinPhone = record.phone;
						var pinPic = record.pinPic;
						var friends = record.nearbyPins;
						var pinMessage = record.pinMessage;
						var noteDate = $filter('date')(record.createdAt, 'd-M-yyyy');
						var noteMessage = record.note ? record.note : 'No notes yet';

						$rootScope.nearbyPins = $rootScope.nearbyPins || {};
						$rootScope.nearbyPins[record.id] = record.nearbyPins;

						var infoWindowContent = $compile(
							'<div class="everything">' +
								'<div id="infowindow" class="infowindow" ng-controller="MapsCtrl as maps">' +
								'<div class="top-bar-friend">' +
								'<div class="empty-space">' +
								'</div>' +
								'<div class="place-name">' +
								cityName +
								',' +
								countryCode +
								'</div>' +
								'</div>' +
								'<div class="dates-there">' +
								'<div class="date from">' +
								'From: ' +
								startDate +
								'</div>' +
								'<div class="date to">' +
								'To: ' +
								endDate +
								'</div>' +
								'</div>' +
								'<div class="tabs">' +
								'<div class="note-pic-tab tab" ng-class="{selected:maps.notes === true}" ng-click="maps.notes = true">' +
								'<img class="camera" ng-if="maps.notes" src="../assets/Notes - White.png">' +
								'<img class="camera" ng-if="!maps.notes" src="../assets/Notes - Grey.png">' +
								'</div>' +
								'<div class="friend-tab tab" ng-class="{selected:maps.notes === false}" ng-click="maps.notes = false">' +
								'<img class="little-man" ng-if="!maps.notes" src="../assets/Pin Man - White.png">' +
								'<img class="little-man" ng-if="maps.notes" src="../assets/Pin Man - Grey.png">' +
								'</div>' +
								'</div>' +
								'<div class="tab-content">' +
								'<div class="note-pic-display" ng-if="maps.notes">' +
								'<div class="note-date">' +
								noteDate +
								'</div>' +
								'<div class="note-message">' +
								noteMessage +
								'</div>' +
								'</div>' +
								'<div class="friends-display" ng-if="!maps.notes">' +
								'<div class="friends-table-head">' +
								'<div class="friend-col who">Who...</div>' +
								'<div class="white-vert1">|</div>' +
								'<div class="friend-col when">When...</div>' +
								'<div class="white-vert2">|</div>' +
								'<div class="friend-col pin">Pin...</div>' +
								'</div>' +
								'<div class="friends-table-content" ng-repeat="friendPin in nearbyPins[\'' +
								record.id +
								'\']">' +
								'<img class="friend-pic profile-pic" ng-src="{{friendPin.user.profilePic}}">' +
								'<div class="friend-name" style="width : 50px !important">{{friendPin.user.firstName}} {{friendPin.user.lastName}}</div>' +
								'<div class="friend-pin-date">{{friendPin.createdAt | date: \'d-M-yyyy\'}}</div>' +
								'<img class="friend-pin" ng-src="{{friendPin.pinPic}}">' +
								'</div>' +
								'</div>' +
								'</div>' +
								'<div class="bottom-bar">' +
								'<rating value="' +
								rating +
								'" max="5" size="20px" color="#FFF" interactive="false"></rating>' +
								'<div class="pin-message">' +
								pinMessage +
								'</div>' +
								'<img class="my-pin" src="' +
								pinPic +
								'">' +
								'</div>' +
								'</div>' +
								//'<div class="arrow">' +
								//'</div>' +
								'<div>'
						)($rootScope);

						addInfoWindow(marker, infoWindowContent[0], record);
					}
					var markerCluster = new MarkerClusterer(map, markers, {
						// imagePath: '../assets/clusterMarker',
						maxZoom: 12,
						styles: [
							{
								url: '../assets/clusterMarker1.png',
								width: 32,
								textColor: 'white',
								height: 48,
								anchor: [0, 0]
							}
						]
					});
				});
			}

			function addInfoWindow(marker, message, record) {
				marker.infoWindow = new google.maps.InfoWindow({
					content: message,
					maxWidth: 260,
					maxHeight: 300
				});

				google.maps.event.addListener(marker, 'click', function() {
					if (infoWindow !== null) {
						infoWindow.close();
					}
					marker.infoWindow.open(map, marker);
					maps.onMarkerClick({
						choice: true
					});
					map.setCenter(
						new google.maps.LatLng(marker.getPosition().lat() + 0.0012, marker.getPosition().lng() - 0.006)
					);
					map.setZoom(15);
					infoWindow = marker.infoWindow;
				});

				google.maps.event.addListener(marker.infoWindow, 'domready', function() {
					var iwOuter = document.getElementsByClassName('gm-style-iw')[0];
					var iwBackground = iwOuter.previousElementSibling;
					// Remove the background shadow DIV
					iwBackground.children[3].style.width = '220px';
					iwBackground.children[3].style.display = 'none';
					iwBackground.children[3].style.width = '0px';
					iwBackground.children[1].style.height = '250px';
					iwBackground.children[1].style.display = 'none';
					iwBackground.children[1].style.width = '0px';
					iwBackground.children[0].style.display = 'none';
					iwBackground.children[0].style.width = '0px';
					iwBackground.children[2].style.display = 'none';
					iwBackground.children[2].style.width = '0px';
					iwOuter.parentNode.parentNode.style.left = '-135px';
					iwOuter.parentNode.parentNode.style.marginTop = '115px';
					var iwCloseBtn = iwOuter.nextElementSibling;
					iwCloseBtn.style.left = '5px';
					iwCloseBtn.innerHTML = 'X';
					iwCloseBtn.style.top = '5px';
					iwCloseBtn.style.fontSize = '15px';
					iwCloseBtn.style.height = '15px';
					iwCloseBtn.style.color = 'white';
					iwCloseBtn.style.backgroundColor = 'transparent';
				});
			}

			function placeMarkerAndPanTo(latLng, map) {
				var marker = new google.maps.Marker({
					position: latLng,
					map: map
				});
			}
		}
	}
})();
