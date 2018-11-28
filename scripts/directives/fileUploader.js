(function() {
   
    angular.module("jurnie").directive("ngUploadChange", function () {
	    return {
	        scope: {
	            ngUploadChange: "&"
	        },
	        link: function ($scope, $element, $attrs) {
	            $element.on("change", function (event) {
	                $scope.$apply(function () {
	                    $scope.ngUploadChange({ $event: event })
	                })
	            })
	            $scope.$on("$destroy", function () {
	                $element.off();
	            });
	        }
	    }
	});
})();
