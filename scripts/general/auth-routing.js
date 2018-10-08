(function() {
	angular.module('jurnie').run(function($rootScope, Auth, $state, $log) {
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			//if not logged-in and not going to login/signup, go to login/signup
			if (
				!Auth.payload &&
				![
					'app.landing',
					'app.signup',
					'app.about',
					'app.invest',
					'app.careers',
					'app.resetPassword',
					'app.forgotPassword'
				].includes(toState.name)
			) {
				event.preventDefault();
				$state.transitionTo('app.landing');
			} else if (Auth.payload && ['app.landing', 'app.signup'].includes(toState.name)) {
				//if logged-in and heading to login page, go to profile page instead
				event.preventDefault();
				$state.transitionTo('app.home');
			} else if (fromState.name === 'app.signup' && toState.name === 'app.landing') {
				toParams = toParams || {};
				toParams.emailInviteId = fromParams.emailInviteId;
				toParams.fbInviteId = fromParams.fbInviteId;
			} else if (fromState.name === 'app.landing' && toState.name === 'app.signup') {
				toParams = toParams || {};
				toParams.emailInviteId = fromParams.emailInviteId;
				toParams.fbInviteId = fromParams.fbInviteId;
			}
		});

		$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
			debugger;
			$log.error(error.message);
			$log.error(error.stack);
		});
	});
})();
