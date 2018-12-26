(function () {
    angular.module('jurnie').controller('myPinController', myPinController);

    function myPinController($uibModal, $uibModalInstance, Pin, $scope, $state) {
        var vm = this;
        $scope.close = close;
        $scope.goToMap = goToMap;
        $scope.recordsIndicator = false;
        init();

        function init() {
            Pin.list().then(function (response) {
                $scope.records = response.data;
                $scope.recordsIndicator = true;
                //$scope.apply();
               // alert("hello");
                console.log("pins", $scope.records);
            });
        }
        function close() {
            $uibModalInstance.dismiss('cancel');
        }
        function goToMap(lat, lng) {
            $uibModalInstance.dismiss('cancel');
            $state.go('app.home', { searched: true, lat: lat, long: lng});
            
        }
    }
})();