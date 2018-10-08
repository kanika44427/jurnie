(function() {
	angular.module('jurnie').controller('NotMyFriendController', notFriendCtrl);

	function notFriendCtrl(Auth, $stateParams, $rootScope, $timeout, person, Friend) {
		var vm = this;

		vm.person = person;

		vm.choice = false;
		vm.whichPin = null;
		vm.friendId = $stateParams.id;
		vm.friendAdded = false;
		vm.inviteSent = false;

		vm.changeChoice = changeChoice;
		vm.addFriend = addFriend;

		vm.coords = {
			latitude: $stateParams.latitude,
			longitude: $stateParams.longitude
		};

		$rootScope.$emit('reload_friendmap', vm.coords);

		function changeChoice(choice) {
			$timeout(function() {
				vm.choice = choice;
			});
		}

		function addFriend() {
			Friend.inviteFriend(vm.friendId).then(function() {
				vm.inviteSent = true;
			});
		}
	}
})();
