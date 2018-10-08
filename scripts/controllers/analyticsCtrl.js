(function() {
	angular.module('jurnie').controller('AnalyticsController', analyticsCtrl);

	function analyticsCtrl(Analytics, User) {
		var vm = this;
		vm.analytics = Analytics;

		vm.allDatesSet = true;
		vm.loading = false;
		vm.from = new Date();
		vm.to = new Date();
		vm.pinCarot = 'dateCreated';
		vm.signupCarot = 'birthday';
		vm.signupCarot = 'birthday';
		vm.ageSort = 'age';
		vm.nationalitySort = 'nationality';

		vm.rerun = rerun;
		vm.allDates = allDates;
		vm.showChart = showChart;
		vm.pinCarotSet = pinCarotSet;
		vm.signupCarotSet = signupCarotSet;
		vm.changeAgeFilter = changeAgeFilter;
		vm.changeNationalityFilter = changeNationalityFilter;
		console.log('analytics', vm.analytics);

		vm.chart = 'pins';

		function showChart(chart) {
			vm.chart = chart;
		}

		function pinCarotSet(cat) {
			if (vm.pinCarot === '-' + cat) {
				vm.pinCarot = cat;
			} else {
				vm.pinCarot = '-' + cat;
			}
		}
		function signupCarotSet(cat) {
			if (vm.signupCarot === '-' + cat) {
				vm.signupCarot = cat;
			} else {
				vm.signupCarot = '-' + cat;
			}
		}
		function changeAgeFilter() {
			if (vm.ageSort === '-age') {
				vm.ageSort = 'age';
			} else {
				vm.ageSort = '-age';
			}
		}
		function changeNationalityFilter() {
			if (vm.nationalitySort === '-nationality') {
				vm.nationalitySort = 'nationality';
			} else {
				vm.nationalitySort = '-nationality';
			}
		}

		function rerun() {
			vm.loading = true;
			User.getStats(vm.from.getTime(), vm.to.getTime()).then(
				function(response) {
					vm.analytics = response.data;
					console.log('updated analytics', vm.analytics);
					vm.allDatesSet = false;
					vm.loading = false;
				},
				function(err) {
					console.error('error:', err);
					vm.loading = false;
				}
			);
		}

		function allDates() {
			vm.loading = true;
			User.getStats().then(
				function(response) {
					vm.allDatesSet = true;
					vm.analytics = response.data;
					console.log('updated analytics (all dates)', vm.analytics);
					vm.loading = false;
				},
				function(err) {
					console.error('error:', err);
					vm.loading = false;
				}
			);
		}
	}
})();
