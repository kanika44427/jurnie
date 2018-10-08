(function() {
	angular.module('jurnie').directive('fileUploader', fileUploader);

	function fileUploader(ServerUrl, $http, $rootScope, $timeout) {
		return {
			restrict: 'E',
			link: fuLink,
			templateUrl: '/scripts/directives/templates/file-uploader.html',
			scope: {
				uploadUrl: '&',
				onUpload: '&',
				imgClass: '<',
				imgUrl: '<'
			},
			controller: fuCtrl,
			controllerAs: 'fu',
			bindToController: true,
			replace: true
		};

		function fuLink(scope, element, attrs, ctrl) {
			ctrl.id = guid();
			attrs.id = ctrl.id;
			const input = element.find('input');

			input.on('change', function() {
				scope.$apply(function() {
					const file = input[0].files[0];
					ctrl.uploadName = file.name;
					const fd = new FormData();
					fd.append('file', file);
					ctrl.loading = true;
					$rootScope.$emit('start-file-upload');
					$http
						.post(ServerUrl + attrs.uploadUrl, fd, {
							transformRequest: angular.identity,
							headers: { 'Content-Type': undefined }
						})
						.then(
							function(response) {
								ctrl.onUpload()(response.data);
								$rootScope.$emit('end-file-upload');
								ctrl.loading = false;
								return response.data;
							},
							function(err) {
								$rootScope.$emit('end-file-upload');
								ctrl.uploadName = null;
								ctrl.loading = false;
								return err;
							}
						);
				});
			});

			input.parent().parent().on('click', function() {
				$timeout(function() {
					input[0].click();
				}, 0);
			});

			input.parent().parent().next().on('click', function() {
				$timeout(function() {
					input[0].click();
				}, 0);
			});

			element.find('img').on('click', function() {
				$timeout(function() {
					input[0].click();
				}, 0);
			});

			input.on('click', function(event) {
				event.stopPropagation();
			});
		}

		function fuCtrl() {}

		function guid() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		}
	}
})();
