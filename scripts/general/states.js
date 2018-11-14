(function() {
	angular.module('jurnie').config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise(function($injector) {
			$injector.invoke([
				'$state',
				function($state) {
					$state.go('app.landing');
				}
			]);
		});

		$stateProvider
			.state('app', {
				url: '',
				abstract: true,
				templateUrl: '../templates/parent.html',
				controller: 'ParentController as parent',
				cache: false
			})
            .state('oauthsuccess', {
                url: '/access_token={access_token}',
                templateUrl: '../templates/landing.html',
                controller: 'OAuthLoginController'
            })
			.state('app.landing', {
			    url: '/landing',
			    templateUrl: '../templates/landing.html',
			    controller: 'LandingController as landing'
			})
			.state('app.signup', {
				url: '/signup?firstName&lastName&password&bday&gender&email&emailInviteId&fbInviteId',
				templateUrl: '../templates/signup.html',
				controller: 'SignupController as signup',
				resolve: {
					travellerTypes: function(TravellerType, SweetAlert) {
						return TravellerType.list().then(
							function(response) {
								return response.data;
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
					emailInvite: function($stateParams, EmailInvite, SweetAlert) {
						return !$stateParams.emailInviteId
							? null
							: EmailInvite.grab($stateParams.emailInviteId).then(
									function(response) {
										return response.data;
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
					fbInvite: function($stateParams, FBInvite, SweetAlert) {
						return !$stateParams.fbInviteId
							? null
							: FBInvite.grab($stateParams.fbInviteId).then(
									function(response) {
										return response.data;
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
					}
				}
			})
			.state('app.add_friends', {
				url: '/add_friends',
				templateUrl: '../templates/add_friends.html',
				controller: 'AddFriendsController as add'
			})
			.state('app.home', {
				url: '/home?searched?lat&long',
				templateUrl: '../templates/home.html',
				controller: 'HomeController as home',
				cache: false
			})
            
			.state('app.friend', {
				url: '/friend/:id?latitude&longitude',
				templateUrl: '../templates/friend.html',
				controller: 'FriendController as friend',
				cache: false,
				resolve: {
					friend: function(User, $stateParams, $rootScope, $state) {
						return User.grab($stateParams.id).then(
							function(response) {
								$rootScope.$emit('view_friend', response.data);
								return response.data;
							},
							function(err) {
								$state.transitionTo('app.notMyFriend', { id: $stateParams.id });
							}
						);
					}
				}
			})
			.state('app.notMyFriend', {
				url: '/notFriend/:id',
				templateUrl: '../templates/notMyFriend.html',
				controller: 'NotMyFriendController as notMyFriend',
				resolve: {
					person: function(Friend, $stateParams, $rootScope) {
						return Friend.getNonFriend($stateParams.id).then(
							function(response) {
								$rootScope.$emit('view_friend', response.data);
								return response.data;
							},
							function(err) {
								console.error('error:', err);
							}
						);
					}
				}
			})
			.state('app.about', {
				url: '/about',
				templateUrl: '../templates/about.html',
				controller: 'AboutController as about'
			})
			.state('app.careers', {
				url: '/careers',
				templateUrl: '../templates/careers.html',
				controller: 'CareersController as careers'
			})
			.state('app.invest', {
				url: '/invest',
				templateUrl: '../templates/invest.html',
				controller: 'InvestController as invest'
			})
			.state('app.resetPassword', {
				url: '/reset-password?code',
				templateUrl: '../templates/resetPassword.html',
				controller: 'ResetPasswordController as rp',
				resolve: {
					code: function($stateParams) {
						return $stateParams.code;
					}
				}
			})
			.state('app.forgotPassword', {
				url: '/forgot-password',
				templateUrl: '../templates/forgotPassword.html',
				controller: 'ForgotPasswordController as fp'
			})
			.state('app.analytics', {
				url: '/analytics',
				templateUrl: '../templates/analytics.html',
				controller: 'AnalyticsController as analytics',
				resolve: {
					Analytics: function(User, Auth) {
						return Auth.getMe().then(
							function(response) {
								return User.getStats().then(
									function(response) {
										return response.data;
									},
									function(err) {
										console.error('error:', err);
									}
								);
							},
							function(err) {
								console.error('error:', err);
							}
						);
					}
				}
			});
	});
})();


angular.module('jurnie').controller("OAuthLoginController", function ($scope, $stateParams, $window, $state) {
    var $parentScope = $window.opener.angular.element(window.opener.document).scope();
    if (angular.isDefined($stateParams.access_token)) {
        $parentScope.$broadcast("igAccessTokenObtained", { access_token: $stateParams.access_token })
    }
    $window.close();
});