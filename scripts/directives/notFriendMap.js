(function() {
	'use strict';
	angular.module('jurnie').controller('NotFriendMapsCtrl', notMapsCtrl).directive('notfriendmap', notfriendmap);

	function notMapsCtrl(Pin, $scope, $rootScope, $stateParams) {
		var vm = this;
	}

	function notfriendmap(Pin, $localStorage, $compile, $window, $filter, $rootScope, $stateParams) {
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
			controller: 'NotFriendMapsCtrl',
			controllerAs: 'maps',
			bindToController: true,
			link: linkFn
		};

		function linkFn(scope, elem, attrs, maps, $window) {
			var map;
			initMap();
			function initMap() {
				map = new google.maps.Map(document.getElementById('map'), {
					center: { lat: -34.397, lng: 150.644 },
					zoom: 8
				});
			}
		}
	}
})();
