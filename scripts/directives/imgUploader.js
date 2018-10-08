(function() {
	angular.module('jurnie').directive('imgUploader', imgUploader);

	function imgUploader(ServerUrl, $http, $rootScope, $timeout) {
		return {
			restrict: 'E',
			link: fuLink,
			templateUrl: '/scripts/directives/templates/img-uploader.html',
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

			element.find('input').on('change', function() {
				scope.$apply(function() {
					var input = element.find('input');
					var file = input[0].files[0];
					var fd = new FormData();
					fd.append('file', file);
					ctrl.loading = true;
					$rootScope.$emit('start-upload');
					$http
						.post(ServerUrl + attrs.uploadUrl, fd, {
							transformRequest: angular.identity,
							headers: { 'Content-Type': undefined }
						})
						.then(
							function(response) {
								ctrl.onUpload()('https' + response.data.file.s3Loc.slice(4));
								$rootScope.$emit('end-upload');
								ctrl.loading = false;
								return response.data;
							},
							function(err) {
								$rootScope.$emit('end-upload');
								ctrl.loading = false;
								return err;
							}
						);
				});
			});

			element
				.find('input')
				.parent()
				.parent()
				.on('click', function() {
					$timeout(function() {
						element.find('input')[0].click();
					}, 0);
				});

			element.find('img').on('click', function() {
				$timeout(function() {
					element.find('input')[0].click();
				}, 0);
			});

			element.find('input').on('click', function(event) {
				event.stopPropagation();
			});
		}

		function fuCtrl() {
			var vm = this;
		}

		function guid() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		}
	}
})();
