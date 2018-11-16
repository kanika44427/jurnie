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
        instagramService
	) {
		var vm = this;
		vm.isAdmin = false;

		vm.mobileScreen = false;
		vm.mobileLogClicked = false;

		vm.login = login;
		vm.logout = logout;
		vm.goToAnalytics = goToAnalytics;
		vm.openSettings = openSettings;
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
			    $localStorage.instaToken = result;
			    instagramService.login();
            }
			getMe();
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
					Auth.getMe().then(function() {
					    $state.go('app.home');
						vm.isLoggedIn = true;
					});
				}
			});
		}

		function logout() {
			vm.user = null;
			Auth.logout();
			init();
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
		    facebookService.getLoginStatus().then(function (response) {
		        if (response.status == "connected") {
		            $state.go('app.about');
		        }
		        else {
		            facebookService.login().then(function (response) {
		                alert("login with facebook successfully" + JSON.stringify(response) + "redirecting to about page as currently token is not generating through node code");
		                $state.go('app.about');
		            });
		        }

		    });
		    
		}

		function signUpWithInstagram() {
		    instagramService.authorize();
               
		}
	}
})();
