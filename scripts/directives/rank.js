(function() {
	angular.module('jurnie').directive('rank', rank);

	function rank() {
		return {
			restict: 'E',
			link: link,
			templateUrl: '/scripts/directives/templates/rank.html',
			scope: {
				user: '<',
				pins: '<',
				friend: '<'
			},
			replace: true,
			bindToController: true,
			controller: function() {},
			controllerAs: '$ctrl'
		};
	}

	function link(scope, el, attrs, ctrl) {
		scope.$watch(
			() => ctrl.pins,
			() => {
				ctrl.pins = ctrl.pins || 0;
				setProgress();
			}
		);
		function setProgress() {
			el.find('rank-progress').css('width', (ctrl.pins > 100 ? 100 : ctrl.pins) + '%');
		}
	}
})();
