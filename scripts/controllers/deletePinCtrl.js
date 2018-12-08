﻿(function () {
    angular.module('jurnie').controller('deletePinCtrl', deletePinCtrl);

    function deletePinCtrl(
        $uibModalInstance,
        $rootScope, 
        httpService,
        pinDetail,
        $scope,
        Pin,
        imageDetail

	) {
        var vm = this;
        vm.cancelPinDelete = cancelPinDelete;
        vm.deletePin = deletePin;
        vm.deleteImage = deleteImage;
        $scope.pinDetail = pinDetail;
        $scope.imageDetail = imageDetail;
        vm.cancelImageDelete = cancelImageDelete;
        function deletePin() {
            Pin.remove($scope.pinDetail.id).then(function (response) {
                alert("pin deleted successfully.");
                $uibModalInstance.dismiss('cancel');
                $rootScope.$emit('cancel');
            });

        }
        function cancelPinDelete() {
            $rootScope.$emit('cancel');
            $uibModalInstance.dismiss('cancel');
        }
        function cancelImageDelete() {
            $rootScope.$emit('cancel');
            $uibModalInstance.dismiss('cancel');
        }
        function deleteImage() {

            httpService.deleteImage($scope.imageDetail.id, $scope.imageDetail.photoUrl).then(function (response) {
                alert("Image deleted successfully.");
                $uibModalInstance.dismiss('cancel');
            });
        }
    }
   
}
)();