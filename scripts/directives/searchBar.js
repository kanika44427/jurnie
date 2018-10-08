(function() {
	angular.module('jurnie').directive('searchBar', searchBar);

	function searchBar() {
		return {
			restrict: 'E',
			templateUrl: '/scripts/directives/templates/searchBar.html',
			link: linkFn,
			controller: searchCtrl,
			controllerAs: 'search',
			scope: {
				ignorePlaces: '<',
				placeCb: '&',
				personCb: '&'
			},
			bindToController: true
		};
	}

	function linkFn(scope, el, attrs) {
		var dropdown = el.find('div').find('div');
		el.find('input').on('focus', function(event) {
			dropdown.removeClass('hide');
			el.find('input').addClass('searching');
		});
		el.find('input').on('blur', function(event) {
			dropdown.addClass('hide');
			el.find('input').removeClass('searching');
			el.find('input')[0].value = '';
		});
	}

	function searchCtrl($state, Search, $rootScope) {
		var vm = this;

		vm.search = search;

		vm.searchText = '';
		vm.searchFocused = false;
		var lastSearchTimeout = null;

		function search() {
			if (lastSearchTimeout) clearTimeout(lastSearchTimeout);
			if (vm.searchText === '') {
				vm.people = null;
				vm.places = null;
				return;
			}
			var currentSearch = vm.searchText;
			lastSearchTimeout = setTimeout(function() {
				if (currentSearch === vm.searchText) {
					Search.search(vm.searchText).then(function(res) {
						vm.people = res.data.people;
						vm.places = res.data.places;
					});
				} else {
					return;
				}
			}, 100);
		}
	}

	// HELPER FUNCTIONS
})();
