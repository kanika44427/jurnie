(function() {
	'use strict';
	angular.module('jurnie').controller('MapsCtrl', mapsCtrl).directive('googlemaps', googleMaps);

	function mapsCtrl(Pin, $uibModal, Search,httpService,$rootScope) {
		var vm = this;

		vm.notes = false;
		vm.friends = true;
		// vm.records = Pin.pins;
		vm.animationsEnabled = true;
		vm.photos = [];
		vm.makeNewPin = makeNewPin;
		vm.open = open;
		vm.editPin = editPin;
		vm.deletePin = deletePin;
		vm.init = init;
		vm.uploadImageOnIcon = uploadImageOnIcon;
		vm.init(() => {});
		vm.fileChanged = fileChanged;
		vm.photoTabClick = photoTabClick;
		vm.deleteImage = deleteImage;
		function init(cb) {
			// console.log('STACK TRACE: ', new Error().stack);
			Pin.list().then(function(response) {
				vm.records = response.data;
				cb(response.data);
			});
		}

		function photoTabClick(userId, id)
		{
		    vm.notes = true;
		    
		        httpService.getAllPhotos(userId, id).then(function(response){
		            var response = JSON.parse(response);
		            if(response.message == 'Record found' && response.status == 1){
		                vm.photos = response.data;
		                vm.noPhotoFound = false;
		                //alert("response");
		            }
		            else{
		                vm.photos = [];
		                vm.noPhotoFound = true;
		            }
		        });
		    
		}
		function editPin(id, latLng, lat, long) {
			open(id, latLng, lat, long);
		}

		function deletePin(userId, pinId, lat, lng) {
			
			httpService.deleteMarker(userId, pinId).then(function(response) {
			    alert("pin deleted successfully.");
			    $rootScope.$emit('reload_map', { longitude: lat, latitude: lng, changed: false});
			});
		
		}
		function deleteImage(id, url){
		    httpService.deleteImage(id, url).then(function(response) {
		        alert("Image deleted successfully.");
		        httpService.getAllPhotos(userId, id).then(function(response){
		            var response = JSON.parse(response);
		            if(response.message == 'Record found' && response.status == 1){
		                vm.photos = response.data;
		                vm.noPhotoFound = false;
		                //alert("response");
		            }
		            else{
		                vm.photos = [];
		                vm.noPhotoFound = true;
		            }
		        });
		    });
		}
		function makeNewPin(latLng) {
			vm.open(null, latLng);
		}
	
		function uploadImageOnIcon(){
				$("#imgupload").click();
		}
        
		function fileChanged($event,userId, pinId){
		    var file = $event.target.files[0];
		    var my_pdf_file_as_base64 = "";
		    var file_base64 = getBase64(file, function(e) {
		        my_pdf_file_as_base64 = e.target.result;
		        var user = {
		            userId : userId,
		            pinId : pinId,
		            image : my_pdf_file_as_base64
		        }
		        httpService.uploadPhoto(user).then(function(res){
		            var res = JSON.parse(res);
		            if(res.status == 1 && res.message == "Record inserted successfully"){
		                alert("Photo uploaded sucessfully.");
		                httpService.getAllPhotos(userId, pinId).then(function(response) {
		                    var response = JSON.parse(response);
		                    if(response.message == 'Record found' && response.status == 1){
		                        vm.photos= [];
		                        vm.photos = response.data;
		                        vm.noPhotoFound = false;
		                    }
		                    else{
		                        vm.photos = [];
		                        vm.noPhotoFound = true;
		                    }
		                });
		            }
		        });
		    });

		   
		}
		
		function getBase64(file, onLoadCallback) {
		    var reader = new FileReader();
		    reader.readAsDataURL(file);
		    reader.onload = onLoadCallback;
		    reader.onerror = function (error) {
		        console.log('Error: ', error);
		    };
		}

		
		function open(id, latLng, lat, long) {
			var modalInstance = $uibModal.open({
				animation: vm.animationsEnabled,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: '../templates/newPinModal.html',
				controller: 'NewPinController',
				controllerAs: 'newPin',
                //ks : start 
				//windowClass: 'large-Modal',
			    //size: 'lg',
			    windowClass  : 'vaibhavClass',
                //ks : end
			    resolve: {
			       
					pinToEdit: function(Pin) {
						if (id) {
							return Pin.getOnePin(id).then(
								function(response) {
									return response.data;
								},
								function(err) {
									console.log(err);
								}
							);
						}
					},
					coords: function() {
						if (latLng) {
							return {
								latitude: latLng.lat(),
								longitude: latLng.lng()
							};
						} else {
							return {
								latitude: lat,
								longitude: long
							};
						}
					},
					nearby: function() {
						if (latLng) {
							return Search.getNearby({
								latitude: latLng.lat(),
								longitude: latLng.lng()
							}).then(function(response) {
								return response.data;
							});
						}
					}
				}
			});

			
			modalInstance.closed = function() {
				vm.loadMarkers(false);
			};
		}
	}

	function googleMaps(Pin, $localStorage, $compile, $window, $filter, $rootScope, City, $location, httpService, $q) {
		return {
			restrict: 'E',
			replace: true,
			template: '<div id="map"></div>',
			scope: {
				choice: '=',
				changeChoice: '&',
				onMarkerClick: '&',
				lat: '<',
				long: '<'
			},
			controller: 'MapsCtrl',
			controllerAs: 'maps',
			bindToController: true,
			link: linkFn
		};

		function linkFn(scope, elem, attrs, maps, $window) {
			var map = new google.maps.Map(elem[0]);
			var infoWindow = null;
			var records = Pin.pins;
			maps.loadMarkers = loadMarkers;
			if ($location.search().searched && $location.search().lat && $location.search().long) {
				showPosition({
					longitude: $location.search().long,
					latitude: $location.search().lat
				});
				setTimeout(function() {
					var redPinLocation = new google.maps.LatLng($location.search().lat, $location.search().long);
					placeRedMarker(redPinLocation, map);
					// maps.makeNewPin(redPinLocation);
					// $rootScope.$emit('newPin', redPinLocation);
				}, 100);
			}

			$rootScope.$on('reload_map', function(event, options) {
				var changed = !!options.changed;
				if (options && options.longitude && options.latitude) {
					if (changed) {
						Pin.list(changed).then(function(response) {
							showPosition(options);
						});
					} else {
						showPosition(options);
					}
				} else {
					Pin.list(changed).then(function(response) {
						if (response.data.length) {
							// console.log('reload pins:', response.data);
							showPosition({
								longitude: response.data[0].longitude,
								latitude: response.data[0].latitude
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
				}
			});

			$rootScope.$on('cancel', function() {
				var center = map.getCenter();
				$rootScope.$emit('reload_map', { longitude: center.lng(), latitude: center.lat() });
			});

			if (maps.lat && maps.long) {
				$rootScope.$emit('reload_map', { latitude: maps.lat, longitude: maps.long });
			} else {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						function(position) {
							var userPosition = position;
							$rootScope.$emit('reload_map', {
								latitude: userPosition.coords.latitude,
								longitude: userPosition.coords.longitude
							});
						},
						function(err) {
							City.get();
						}
					);
				} else {
					City.get();
				}
			}

			function getUserLocation() {}

			function showPosition(position) {
				var mapOptions = {
					center: getGoogleLatLong(position),
					zoom: 15,
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

				map.addListener('dblclick', function(e) {
					placeRedMarker(e.latLng, map);
					maps.makeNewPin(e.latLng);
					setTimeout(function() {
						$rootScope.$emit('newPin', e.latLng);
					    //ks : }, 300);
					}, 100);
				});

				loadMarkers(false);

				google.maps.event.addListener(map, 'click', function() {
					maps.onMarkerClick({
						choice: false
					});
					if (infoWindow !== null) {
						infoWindow.close();
					}
				});
			}

			function placeRedMarker(position, map) {
				var marker = new google.maps.Marker({
					position: position,
					map: map,
					icon: {
						url: './assets/clusterMarker1.png',
						// This marker is 20 pixels wide by 32 pixels high.
						scaledSize: new google.maps.Size(18, 28),
						// The origin for this image is (0, 0).
						origin: new google.maps.Point(0, 0),
						// The anchor for this image is the base of the flagpole at (0, 32).
						anchor: new google.maps.Point(0, 32)
					},
					animation: google.maps.Animation.DROP
				});
				marker.addListener('click', function(e) {
					maps.makeNewPin(e.latLng);
					setTimeout(function() {
						$rootScope.$emit('newPin', e.latLng);
					}, 300);
				});
			}

			function getGoogleLatLong(coords) {
				return new google.maps.LatLng(coords.latitude, coords.longitude);
			}

			
			function loadMarkers(changed) {
				// console.log('STACK TRACE: ', new Error().stack);
			    Pin.list(changed).then(function(pins) {
			       
					var records = pins.data;
					var markers = [];
					
					// console.log('pins result:', pins);
					// console.log('fresh load pins:', pins.data);
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
							scaledSize: new google.maps.Size(18, 28),
							// The origin for this image is (0, 0).
							origin: new google.maps.Point(0, 0),
							// The anchor for this image is the base of the flagpole at (0, 32).
							anchor: new google.maps.Point(0, 32)
						};

						var shape = {
							coords: [1, 1, 1, 30, 10, 30, 10, 1],
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
						//var photos = getAllPhotos(record.userId, record.id);
						//console.log("photos", photos);
						var placeDescription = record.description;
						var startDate = $filter('date')(record.startDate, 'yyyy-M-d');
						var endDate = $filter('date')(record.endDate, 'yyyy-M-d');
						var rating = record.rating;
						var pinPhone = record.phone;
						var pinPic = record.pinPic;
						var friends = record.nearbyPins;
						var pinMessage = record.pinMessage;
						var noteDate = $filter('date')(record.createdAt, 'yyyy-M-d');
						var noteMessage = record.note ? record.note : 'No notes yet';
                        
						if (record.nearbyPins.length) {
							var friendsPinsNearby = [];
							var nearbyPins = record.nearbyPins.filter(function(el) {
								if (friendsPinsNearby.includes(el.userId)) {
									return false;
								} else {
									friendsPinsNearby.push(el.userId);
									return true;
								}
							});
							record.nearbyPins = nearbyPins;
						}

						$rootScope.nearbyPins = $rootScope.nearbyPins || {};
						$rootScope.nearbyPins[record.id] = record.nearbyPins;
						console.log('friend pins nearby:', record.nearbyPins);

						var infoWindowContent = $compile(
							    '<div class="everything">' +
								'<div id="infowindow" class="infowindow" ng-controller="MapsCtrl as maps">' +
								'<div class="top-bar">' +
								'<div class="empty-space">' +
								'</div>' +
								'<div class="place-name">' +
								    placeDescription +
								'</div>' +
								'<div class="trash-btn cursor">' +
								'<div class="trash-pic glyphicon glyphicon-edit" ng-click="maps.editPin(\'' +
								    record.id +
								"'," +
								null +
								',' +
								    record.latitude +
								',' +
								    record.longitude +
								')">' +
								'</div>' +
                               
								'<button  ng-click="maps.deletePin(\'' +
								record.userId +
								"','" + 
								record.id + "'"+
                                ',' +
								    record.latitude +
								',' +
								    record.longitude +
								')">' +
                                '<div class="trash-pic glyphicon glyphicon-trash">' +
								'</div>' +
								'</button>'+
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
								'<div class="note-pic-tab tab" ng-class="{selected:maps.notes === false}" ng-click="maps.photoTabClick(\''+
								record.userId +
								"','" + 
								record.id + "'"+
                                ')">' +
								'<img class="camera" ng-if="maps.notes" src="../assets/Notes - White.png">' +
								'<img class="camera" ng-if="!maps.notes" src="../assets/Notes - Grey.png">' +
								'</div>' +
								'<div class="friend-tab tab" ng-class="{selected:maps.notes === true}" ng-click="maps.notes = false">' +
								'<img class="little-man" ng-if="!maps.notes" src="../assets/Pin Man - White.png">' +
								'<img class="little-man" ng-if="maps.notes" src="../assets/Pin Man - Grey.png">' +
								'</div>' +
								'</div>' +
								'<div class="tab-content">' +
								'<div class="note-pic-display" ng-if="maps.notes" style="width: 95%;margin: 0 auto;height: 155px;overflow-y: scroll;border-radius: 0;">' +
                                '<div class="upload-header" style="background: #f7914c;;padding: 5px;text-align: center;color: #fff;border-top-left-radius: 5px;border-top-right-radius: 5px;margin-top: 10px;">'+
                                '<input type="file" id="imgupload" name="imgupload" ng-upload-change="maps.fileChanged($event, \''+
								record.userId +
								"','" + 
								record.id + "'"+
								')" style="display:none;" accept="image/*" /><button style="padding:0; background:none; border:none;" id="OpenImgUpload" ng-click="maps.uploadImageOnIcon()" >Upload Button<i class="trash-pic glyphicon glyphicon-plus"></i></button>'+
                                '</div>'+
                                '<div class="upload-box" style="width:100%;background:#eee;overflow: hidden;overflow: hidden;">'+
                                    '<div ng-repeat="item in maps.photos">'+ //photo div loop start 
                                      '<button  type="button">X</button>'+
                                            '<img ng-src="{{item.photoUrl}}" style="width: 100%;height: 60px;padding: 5px 0px;">'+
                                            //'<button ng-if="maps.photos.length > 0"  ng-click="maps.deleteImage(\'' +
								            //    item.id +
								            //    "','" + 
								            //    item.photoUrl + "'"+
								            //    ')">' +
                                            //  '<div class="trash-pic glyphicon glyphicon-trash"></div>'+
								            //  '</button>'+
                                    '</div>'+ //photo div loop ends
                                    '<div ng-if="maps.noPhotoFound"> No photo found. </div>'+
                                   '</div>'+
                                '</div>'+
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
								'<div class="friend-name">{{friendPin.user.firstName}} {{friendPin.user.lastName}}</div>' +
								'<div class="friend-pin-date">{{friendPin.createdAt | date: \'yyyy-M-d\'}}</div>' +
								'<img class="friend-pin" ng-src="{{friendPin.pinPic}}">' +
								'</div>' +
								'</div>' +
								//'</div>' +
								'<div class="bottom-bar">' +
								'<rating value="' +
								rating +
								'" max="5" color="#FFF" interactive="false"></rating>' +
								'<div class="pin-message">' +
								pinMessage +
								'</div>' +
								'<img class="my-pin" src="' +
								pinPic +
								'">' +
								'</div>' +
								'</div>' +
								'<div class="arrow">' +
								'</div>' +
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
					var bounds = new google.maps.LatLngBounds();
					for (var i = 0; i < markers.length; i++) {
					    bounds.extend(markers[i].getPosition());
					}
					//map.fitBounds(bounds);
				});
			}
			
			function addInfoWindow(marker, message, record) {
				marker.infoWindow = new google.maps.InfoWindow({
					content: message,
					maxWidth: 260,
					maxHeight: 300,
					disableAutoPan: true
				});

				google.maps.event.addListener(marker, 'click', function() {
					if (infoWindow !== null) {
						infoWindow.close();
					}
					maps.photos= [];
					marker.infoWindow.open(map, marker);
					maps.onMarkerClick({
						choice: true
					});

					// var markerCenter = map.getProjection().fromLatLngToPoint(marker.getPosition());
					// var partialNewCenter = new google.maps.Point(markerCenter.x - 21, markerCenter.y);
					// var newCenter = map.getProjection().fromPointToLatLng(partialNewCenter);
					// map.setCenter(newCenter);
					map.setCenter(
						new google.maps.LatLng(marker.getPosition().lat() + 0.003, marker.getPosition().lng() - 0.007)
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
					iwBackground.children[1].style.height = '255px';
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
					iwCloseBtn.style.zIndex = 5;
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
