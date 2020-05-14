(function() {
	angular.module('jurnie').controller('ParentController', parentCtrl);

	function parentCtrl(
		Auth,
		$scope,
		$state,
		$rootScope,
		$uibModal,
		Interaction,
		User,
		$timeout,
		$stateParams,
		// PageLoad,
		Search,
		Friend,
		SweetAlert,
		$localStorage,
        facebookService, 
        instagramService, 
        httpService,
        Pin
	) {
		var vm = this;
		vm.isAdmin = false;
		//$rootScope.loaderIndicator = false;
		vm.mobileScreen = false;
		vm.mobileLogClicked = false;
		vm.login = login;
		vm.logout = logout;
		vm.goToAnalytics = goToAnalytics;
		vm.openSettings = openSettings;
		vm.openMyPins = openMyPins;
		vm.placeCB = placeCB;
		vm.personCB = personCB;
		vm.acceptFriend = acceptFriend;
		vm.denyFriend = denyFriend;
		vm.closeRightSidebar = closeRightSidebar;
		vm.toggleRightSidebar = toggleRightSidebar;
		vm.collapseEverything = collapseEverything;
		vm.toggleLeftSideNav = toggleLeftSideNav;
		vm.preventCollapse = preventCollapse;
		vm.feedClick = feedClick;
		vm.openMobileLogin = openMobileLogin;
		vm.goToForgot = goToForgot;
		vm.wasSeen = wasSeen;
		vm.signUpWithFacebook = signUpWithFacebook;
		vm.signUpWithInstagram = signUpWithInstagram;
		$scope.$watch(
			function() {
				vm.isLoggedIn = !!$localStorage.token;
				return vm.isLoggedIn;
			},
			function(newVal, oldVal) {
				if (
					!vm.isLoggedIn &&
					![
						'app.landing',
						'app.signup',
						'app.about',
						'app.invest',
						'app.careers',
						'app.resetPassword',
						'app.forgotPassword'
					].includes($state.current.name)
				) {
					$state.go('app.landing');
				}
			}
		);

		init();
		
		var isChromium = window.chrome,
			winNav = window.navigator,
			vendorName = winNav.vendor,
			isOpera = winNav.userAgent.indexOf('OPR') > -1,
			isIEedge = winNav.userAgent.indexOf('Edge') > -1,
			isIOSChrome = winNav.userAgent.match('CriOS');

		if (isIOSChrome) {
			vm.chrome = true;
		} else if (
			isChromium !== null &&
			typeof isChromium !== 'undefined' &&
			vendorName === 'Google Inc.' &&
			isOpera === false &&
			isIEedge === false
		) {
			vm.chrome = true;
		} else {
			vm.chrome = false;
		}

		$rootScope.$watch(
			function() {
				return Auth.user;
			},
			function(newVal, oldVal) {
				if (newVal.userTypeId === 1) {
					vm.isAdmin = true;
				}
				if (!newVal) {
					vm.isLoggedIn = false;
				} else {
					vm.isLoggedIn = true;
				}
				vm.user = newVal;
				if (newVal && newVal !== oldVal) {
					Interaction.getInteractions().then(
						function(response) {
							vm.updates = response.data;
							vm.newUpdates = updateNotificationsCount(vm.updates);
							// console.log('updates:', vm.updates);
							// PageLoad.done = true;
						},
						function(err) {
							console.error(err);
							if (err.data && err.data.message) {
								SweetAlert.swal(
									{
										title: 'Something went wrong...',
										text: err.data && err.data.message
											? 'Message: ' + err.data.message
											: 'Sorry about that!',
										confirmButtonColor: '#00A99D',
										confirmButtonText: 'OK',
										type: 'warning'
									},
									function(isConfirm) {}
								);
							}
							// PageLoad.done = true;
						}
					);
				}
			}
		);

		$rootScope.$on('logout', function() {
			vm.user = null;
			vm.isLoggedIn = false;
		    var cookies = document.cookie.split(";");
			for (var i = 0; i < cookies.length; i++) {
			    var cookie = cookies[i];
			    var eqPos = cookie.indexOf("=");
			    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
			}
			window.localStorage.clear();
		});

		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			if (toState.resolve) {
				vm.showSpinner = true;
			}
		});

		$scope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams) {
			vm.showSpinner = false;
		});

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			vm.currState = toState.name;
			if (toState.resolve) {
				vm.showSpinner = false;
			}
			if (toState.name === 'app.notMyFriend') {
				vm.friendMap = true;
				return;
			}
			if (toState.name === 'app.friend') {
				vm.friendMap = true;
				$timeout(function() {
					if (!vm.friend) {
						User.grab(toParams.id).then(
							function(response) {
								vm.friend = response.data;
							},
							function(err) {
								console.error(err);
								if (err.data && err.data.message) {
									SweetAlert.swal(
										{
											title: 'Something went wrong...',
											text: err.data && err.data.message
												? 'Message: ' + err.data.message
												: 'Sorry about that!',
											confirmButtonColor: '#00A99D',
											confirmButtonText: 'OK',
											type: 'warning'
										},
										function(isConfirm) {}
									);
								}
							}
						);
					}
				}, 200);
			} else {
				vm.friendMap = false;
				vm.friend = null;
			}
		});

		$rootScope.$on('view_friend', function(event, user) {
			vm.friend = user;
			if (!vm.friend.profilePic) {
				vm.friend.profilePic = '../../assets/Annonymous.png';
			}
		});

		function init() {
			vm.user = null;
			vm.updates = null;
			vm.newUpdates = null;

			vm.friend = null;
			vm.email = null;
			vm.password = null;

			vm.isLoggedIn = !!$localStorage.token;
			vm.isSigningUp = false;
			vm.isCollapsedHorizontal = true;
			vm.isMainCollapsedHorizontal = true;
			vm.feedCollapsed = true;
			vm.isMobileCollapsed = true;

			vm.friendMap = false;

			vm.mobileScreen = isMobile();
			if (window.location.href.indexOf("access_token") > -1) {
			    var string_parts = window.location.href.split("=");
			    var result = string_parts[string_parts.length - 1];
			    if (result) {
			        $rootScope.loaderIndicator = true; 
			        $localStorage.instaToken = result;
			        instagramService.login().then(function (response) {
						var instaRes = response;
			            if (response.data && response.data.data && response.status == 200) {
			                var fbObject = {
			                    "userSocialType": "instagram",
			                    "provider_id": response.data.data.id,
			                    "first_name": response.data.data.full_name,
			                    "last_name": '(' + response.data.data.username + ')',
			                    "profile_image": response.data.data.profile_picture,
			                    "social_user_name": response.data.data.username
			                }
			                httpService.socialSignup(fbObject).then(function (response) {
			                    if (response.data.message == "User already registered" && response.data.status == 0) {
			                        httpService.socialLogin(fbObject).then(function (response) {
			                            instagramService.getInstaMarkers().then(function (res) {
			                                var taggedPlaces = res.data.data;
			                                if(taggedPlaces && taggedPlaces.length > 0 ){
			                                    for (var i = 0; i < taggedPlaces.length; i++) {
			                                        var taggedInfo = taggedPlaces[i];
			                                        if (taggedInfo.location && taggedInfo.location != null) {
			                                            createInstaMarker(taggedInfo);
			                                        }
			                                        if (i == (taggedPlaces.length - 1)) {
															redirectToHomeExisting(instaRes);
			                                       }
			                                    }
			                                }
			                                else {
			                                    redirectToHomeExisting(instaRes);
			                                }
			                            });
			                            
			                        });
			                    }
			                    else if (response.data.message == "Thank you for registration using facebook" && response.data.status == 1) {
			                        httpService.socialLogin(fbObject).then(function (response) {
			                            instagramService.getInstaMarkers().then(function (res) {
			                                var taggedPlaces = res.data.data;
			                                if (taggedPlaces && taggedPlaces.length > 0) {
			                                    for (var i = 0; i < taggedPlaces.length; i++) {
			                                        var taggedInfo = taggedPlaces[i];
			                                        if (taggedInfo.location && taggedInfo.location != null)
			                                            createInstaMarker(taggedInfo);
			                                        if (i == (taggedPlaces.length - 1)) {
			                                            redirectToHome();
			                                        }
			                                    }
			                                }
			                                else {
			                                    redirectToHome();
			                                }
			                            });

			                        });
			                    }
			                });
			            }
			            else {
                            $rootScope.loaderIndicator = false; 
			                alert("something went wrong");
			            }
			        });
			    }
			    else {
			        $rootScope.loaderIndicator = false; 
			        alert("Something went wrong. Please try again after some time.")
			    }
            }
			getMe();
		}

		function redirectToHome() {
		    Auth.getMe().then(function (response) {
		        if (response) {
		            $localStorage.loginType = "Instagram";
		            $rootScope.loaderIndicator = false; 
		            $state.go('app.home');
                    vm.isLoggedIn = true;
		        }
		    });
		}

		function redirectToHomeExisting(instaResponse) {
		    Auth.getMe().then(function (response) {
		        if (response && response.data) {
		            vm.user = response.data; 
		            vm.user.profilePic = instaResponse.data.data.profile_picture;
		            $localStorage.loginType = "Instagram";
		            vm.user.gender = "male"; 
		            vm.isLoggedIn = true;
		            User.update(vm.user).then(function (data) {
		                $localStorage.loginType = "Instagram";
		                $rootScope.loaderIndicator = false;
		                $state.go('app.home');
		                vm.isLoggedIn = true;
		            }, 
                    function () {
                        $state.go('app.home');

                    });
		        }
		        else {
		            alert("something went wrong");
		            logout();
		        }
		    });
		    
		}
		

		function getMe() {
			if (Auth.payload) {
				Auth.getMe().then(
					function(response) {
						vm.user = response.data;
						Interaction.getInteractions().then(
							function(response) {
								vm.updates = response.data;
								vm.newUpdates = updateNotificationsCount(vm.updates);
								// console.log('updates from getMe:', vm.updates);
								// PageLoad.done = true;
							},
							function(err) {
								console.error(err);
								// PageLoad.done = true;
								if (err.data && err.data.message) {
									SweetAlert.swal(
										{
											title: 'Something went wrong...',
											text: err.data && err.data.message
												? 'Message: ' + err.data.message
												: 'Sorry about that!',
											confirmButtonColor: '#00A99D',
											confirmButtonText: 'OK',
											type: 'warning'
										},
										function() {}
									);
								}
							}
						);
					},
					function(err) {
						console.error(err);
						// PageLoad.done = true;
						SweetAlert.swal(
							{
								title: 'Something went wrong...',
								text: err.data && err.data.message
									? 'Message: ' + err.data.message
									: 'Sorry about that!',
								confirmButtonColor: '#00A99D',
								confirmButtonText: 'OK',
								type: 'warning'
							},
							function(isConfirm) {}
						);
					}
				);
			} else {
				// PageLoad.done = true;
			}
		}

		function login() {
			Auth.login(vm.email, vm.password).then(function(response) {
				if (response) {
				    Auth.getMe().then(function () {
				        $localStorage.loginType = "Traditional";
					    $state.go('app.home');
						vm.isLoggedIn = true;
					});
				}
			});
		}

		function logout() {
		    vm.user = null;
		    facebookService.logout();
			Auth.logout();
			init();
			if($localStorage.loginType == "Instagram"){
                var s = document.createElement("script");
                s.src = "https://instagram.com/accounts/logout";
                $("head").append(s);
			}
			$localStorage.$reset();
           
			
		}

		function openMyPins(screenSize, size) {
		    var modalInstance = $uibModal.open({
		        animation: vm.animationsEnabled,
		        ariaLabelledBy: 'settings-title',
		        ariaDescribedBy: 'settings-body',
		        templateUrl: '../templates/myPinModal.html',
		        controller: 'myPinController',
		        controllerAs: 'myPin',
		        windowClass: 'large-modal',
		        size: 'lg',
		        resolve: {
		            getAllPins : function () {
		                return Pin.list().then(function (response) {
								    return response.data;
								},
								function (err) {
								    console.log(err);
								});
		            }
		        }
		    });
		}

		function openSettings(screenSize, size) {
		    var modalInstance = $uibModal.open({
		        animation: vm.animationsEnabled,
		        ariaLabelledBy: 'settings-title',
		        ariaDescribedBy: 'settings-body',
		        templateUrl: '../templates/settingsModal.html',
		        controller: 'SettingsController',
		        controllerAs: 'settings',
		        windowClass: 'large-modal',
		        size: 'lg'
		    });
		}

		function acceptFriend(id) {
			Friend.acceptFriend(id).then(
				function(response) {
					closeRightSidebar();
					Interaction.getInteractions().then(
						function(response) {
							vm.updates = response.data;
							vm.newUpdates = updateNotificationsCount(vm.updates);
						},
						function(err) {
							console.error(err);
							SweetAlert.swal(
								{
									title: 'Something went wrong...',
									text: err.data && err.data.message
										? 'Message: ' + err.data.message
										: 'Sorry about that!',
									confirmButtonColor: '#00A99D',
									confirmButtonText: 'OK',
									type: 'warning'
								},
								function(isConfirm) {}
							);
						}
					);
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

		function denyFriend(id, idx) {
			Friend.denyFriend(id).then(
				function(response) {
					closeRightSidebar();
					vm.updates.splice(idx, 1);
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

		function placeCB(id) {
			closeLeftSideBar();
			closeRightSidebar();
			$rootScope.searchBarClicked = true; 
			Search.getCoords(id).then(function(response) {
				$state.go('app.home', { searched: true, lat: response.data.lat, long: response.data.lng });
			});
		}

		function personCB(id) {
			closeLeftSideBar();
			closeRightSidebar();
			$state.go('app.friend', { id: id });
		}

		function toggleRightSidebar($event) {
			vm.feedCollapsed = !vm.feedCollapsed;
			if (!vm.feedCollapsed) document.getElementById('right-side-bar').focus();
			$event.stopPropagation();
			$event.preventDefault();
		}

		function closeRightSidebar() {
			vm.feedCollapsed = true;
		}

		function closeLeftSideBar() {
			vm.isMainCollapsedHorizontal = true;
			feedClick();
		}

		function toggleLeftSideNav($event) {
			vm.isMainCollapsedHorizontal = !vm.isMainCollapsedHorizontal;
			$event.stopPropagation();
			feedClick();
			// $event.preventDefault();
		}

		function preventCollapse($event) {
			$event.stopPropagation();
			$event.preventDefault();
		}

		function collapseEverything() {
			closeLeftSideBar();
			closeRightSidebar();
		}

		window.addEventListener(
			'resize',
			function() {
				vm.mobileScreen = isMobile();
				$scope.$apply();
			},
			true
		);

		window.addEventListener(
			'orientationchange',
			function() {
				vm.mobileScreen = isMobile();
			},
			true
		);

		function isMobile() {
			return window.matchMedia('(max-width: 991px)').matches || window.screen.width < 992;
		}

		function feedClick() {
			$rootScope.$emit('feed', vm.isMainCollapsedHorizontal);
			vm.feedOpen = !vm.isMainCollapsedHorizontal;
		}

		function openMobileLogin() {
			vm.mobileLogClicked = true;
		}

		function goToForgot() {
			$state.go('app.forgotPassword');
		}

		function updateNotificationsCount(arr) {
			vm.newUpdates = null;
			var newUpdatesArr = [];
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].isNew) {
					newUpdatesArr.push(arr[i]);
				}
			}
			return newUpdatesArr.length;
		}
		function wasSeen(update) {
			Interaction.hasBeenSeen(update).then(
				function(response) {
					update.isNew = false;
					vm.newUpdates--;
				},
				function(err) {
					console.log('error', err);
				}
			);
		}
		function goToAnalytics() {
			$state.go('app.analytics');
		}

		function signUpWithFacebook() {
		    facebookService.login().then(function (response) {
		        console.log(response);
		        if (response && response.id) {
		            var fbObject = {
		                "first_name": response.first_name,
		                "last_name": response.last_name,
		                "profile_image": response.picture ? response.picture.data.url : '',
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
		                                //console.log("tagged places", tagged_places);
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
		            });
		        }
		        else {
		            alert("Something went wrong. Please try again after some time.")
		        }
		    });

		}

		function createFBMarker(taggedInfo) {
		    var req_obj = {
		        "pinTypeId": 1,
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

		function createInstaMarker(taggedInfo) {
		    var caption = "", created_time = ""; 
		    if(taggedInfo.caption && taggedInfo.caption.text)
		        caption = taggedInfo.caption.text;
		       created_time = taggedInfo.created_time ? Unix_timestamp(taggedInfo.created_time) : "";
		    var req_obj = {
		        "pinTypeId": 1,
		        "latitude": taggedInfo.location.latitude,
		        "longitude": taggedInfo.location.longitude,
		        "startDate": created_time,
		        "endDate": created_time,
		        "rating": -1,
		        "note": caption, 
		        "description": null
		    }
		    var instaPin = true; 
		    Pin.add(req_obj, instaPin).then(function (res) {
		        if(res && res.data){
                     
		        //var imageObj = {
		        //    "userId": res.data.userId,
		        //    "pinId": res.data.id,
		        //    "image": taggedInfo.images.thumbnail.url
		        //}
		        //httpService.uploadInstaImage(imageObj).then(function (res) {
		        //    console.log("photo upload succesfully", imageObj.pinId);
		        //});
		        }
		    });
		}

		function signUpWithInstagram() {
		    instagramService.authorize();
               
		}
		function binEncode(data, userid, pinid ) {
		    var binArray = []
		    var datEncode = "";

		    for (i = 0; i < data.length; i++) {
		        binArray.push(data[i].charCodeAt(0).toString(2));
		    }
		    for (j = 0; j < binArray.length; j++) {
		        var pad = padding_left(binArray[j], '0', 8);
		        datEncode += pad + ' ';
		    }
		    function padding_left(s, c, n) {
		        if (!s || !c || s.length >= n) {
		            return s;
		        }
		        var max = (n - s.length) / c.length;
		        for (var i = 0; i < max; i++) {
		            s = c + s;
		        } return s;
		    }
		   
		    console.log(binArray);
		}

		function Unix_timestamp(t) {

		    var date = new Date(t * 1000);
		    var month = (date.getMonth() + 1).toString();
		    month = month.length > 1 ? month : '0' + month;
		    var day = date.getDate().toString();
		    day = day.length > 1 ? day : '0' + day;
		    return date.getFullYear() + '-' + month + '-' + day + 'T00:00:00.000Z';
		}

		function instaUserUpdate(userObject, instaResponse){
			
		}
	}
})();
