(function() {
	angular.module('jurnie').controller('FriendController', friendCtrl);

	function friendCtrl(Auth, $stateParams, $rootScope, $timeout, friend, Friend) {
		var vm = this;

		vm.friend = friend;

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
