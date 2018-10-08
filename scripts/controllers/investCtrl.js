(function() {
    angular.module('jurnie')
        .controller('InvestController', investCtrl);

    function investCtrl(Auth) {
        var vm = this;

        vm.sendToEmail = sendToEmail;

        function sendToEmail() {

        }

    }
})();