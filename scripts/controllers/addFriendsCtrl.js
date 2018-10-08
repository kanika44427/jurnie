(function() {
	angular.module('jurnie').controller('AddFriendsController', addFriendsCtrl);

	function addFriendsCtrl(Auth, $state, ModalService, FBInvite, Friend, EmailInvite, SweetAlert) {
		var vm = this;

		// large option booleans
		vm.facebookChosen = false;
		vm.emailChosen = false;
		vm.jurnieChosen = false;
		vm.selectMethod = selectMethod;

		// facebook booleans
		vm.facebookBtn = false;
		vm.facebookFriends = false;

		vm.emailName = null;
		vm.jurnieUsers = [];
		vm.emailAddress = null;
		vm.emailsAdded = false;
		vm.emailsList = [];
		vm.jurnieFriends = [];
		vm.checkedJurnieFriends = [];

		vm.facebookAuth = facebookAuth;
		vm.addEmail = addEmail;
		vm.sendEmails = sendEmails;
		vm.checkJurnieFriend = checkJurnieFriend;
		vm.addJurnieFriends = addJurnieFriends;
		vm.goToHome = goToHome;
		vm.addJurnieUser = addJurnieUser;
		vm.jurnieUsers = [];
		vm.jurnieIds = [];
		vm.removeJurnieName = removeJurnieName;
		vm.removeEmailName = removeEmailName;

		function facebookAuth() {
			// do facebook stuff
			vm.facebookBtn = false;
			vm.facebookFriends = true;
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					openFBDialog();
				} else {
					FB.login(function() {
						openFBDialog();
					});
				}
			});
		}

		function openFBDialog() {
			FBInvite.add().then(function(response) {
				FB.ui({
					method: 'send',
					link: 'https://www.jurnie.com/#!/signup?fbInviteId=' + response.data.id,
					name: 'Checkout my Jurnie!'
				});
			});
		}

		function addEmail() {
			var friend = {
				name: vm.emailName,
				email: vm.emailAddress
			};
			if (friend.name && friend.email) {
				vm.emailsAdded = true;
				vm.emailsList.push(friend);
				vm.emailName = null;
				vm.emailAddress = null;
			}
		}

		function selectMethod(type) {
			if (type === 'fb') {
				vm.facebookChosen = true;
				vm.emailChosen = false;
				vm.jurnieChosen = false;
				facebookAuth();
			} else if (type === 'email') {
				vm.emailChosen = !vm.emailChosen;
				vm.facebookChosen = false;
				vm.jurnieChosen = false;
			} else if (type === 'jurnie') {
				vm.jurnieChosen = !vm.jurnieChosen;
				vm.facebookChosen = false;
				vm.emailChosen = false;
			}
		}

		function sendEmails(emails) {
			EmailInvite.add(vm.emailsList).then(function() {
				vm.emailsList = [];
				vm.emailsAdded = false;
			});
		}

		function checkJurnieFriend(friend) {
			if (friend) vm.checkedJurnieFriends.push(friend);
		}

		function addJurnieFriends() {
			for (i = 0; i < vm.jurnieUsers.length; i++) {
				vm.jurnieIds.push(vm.jurnieUsers[i].id);
			}
			Friend.inviteMultipleFriends(vm.jurnieIds).then(function() {
				vm.jurnieIds = [];
				vm.jurnieUsers = [];
				SweetAlert.swal(
					{
						title: 'Added!',
						confirmButtonColor: '#00A99D',
						confirmButtonText: 'OK',
						type: 'success'
					},
					function(isConfirm) {}
				);
			});
		}

		function addJurnieUser(id) {
			Friend.getNonFriend(id).then(function(response) {
				vm.jurnieUsers.push(response.data);
			});
		}

		function removeJurnieName(friend) {
			for (i = 0; i < vm.jurnieUsers.length; i++) {
				if (vm.jurnieUsers[i] === friend) {
					vm.jurnieUsers.splice(i, 1);
				}
			}
		}

		function removeEmailName(email) {
			for (i = 0; i < vm.emailsList.length; i++) {
				if (vm.emailsList[i] === email) {
					vm.emailsList.splice(i, 1);
				}
			}
		}

		function goToHome() {
			if (vm.jurnieIds) {
				for (var i = 0; i > vm.jurnieIds.length; i++) {
					addJurnieUser(vm.jurnieIds[i]);
				}
			}
			if (vm.emailsList) {
				sendEmails(vm.emailsList);
			}
			SweetAlert.swal(
				{
					title: 'Hey!',
					text: 'Thanks for signing up for Jurnie! We’re a brand new platform, so there might be some bugs. If you come across any, or if you have other suggestions please email us: info@thejurnie.com. We hope you love it, now go start sharing with your friends!',
					confirmButtonColor: '#00A99D',
					confirmButtonText: 'Will do!'
				},
				function(isConfirm) {
					$state.go('app.home');
				}
			);
		}
	}
})();
