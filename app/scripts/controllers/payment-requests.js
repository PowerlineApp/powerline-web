'use strict';

angular.module('app').controller('PaymentRequestCtrl', function ($scope, $routeParams, paymentRequests, session, $route, serverUrl, $http, flurry) {
  $scope.loading = true;

  load();

  $scope.view = {

  };

  $scope.data = {
    privacy: 0
  };

  $scope.pay = function () {
    if (!session.getToken()) {
      $scope.isShowLogin = true;
    } else if ($scope.data.option.payment_amount || $scope.data.option.is_user_amount) {
      $scope.view.showCardsInfo = true;
    } else {
      $scope.view.showAnswerForm = true;
    }
  };

  $scope.reloadAndPay = function () {
    load().then(function () {
      if (!$scope.paymentRequest.get('is_answered')) {
        $scope.pay();
      }
    }).finally(function () {
      $scope.isShowLogin = false;
    });
  };

  $scope.answer = function () {
    if ($scope.data.option.is_user_amount && !$scope.data.payment_amount) {
      alert('Payment amount cannot be blank');
      return;
    }
    $scope.submitting = true;
    $scope.paymentRequest.answer({
      option_id: $scope.data.option.id,
      comment: $scope.data.comment,
      privacy: $scope.data.privacy,
      payment_amount: $scope.data.payment_amount
    }).then(function () {
      flurry.log('answered to payment request', {id: $scope.paymentRequest.get('id')});
      $route.reload();
    }, function () {
      alert('Error occurred.');
      $route.reload();
    });
  };

  function load() {
    return paymentRequests.loadOne($routeParams.id).then(function (paymentRequest) {
      $scope.paymentRequest = paymentRequest;
      $scope.loading = false;
      if (paymentRequest.get('answer_entity')) {
        $http.get(serverUrl + '/api/answers/payment-history/' + paymentRequest.get('answer_entity').id).then(function (response) {
          $scope.transaction = response.data && response.data !== 'null' ? response.data : null;
        });
      }
    }, function (response) {
      $scope.loading = false;
      if (404 === response.status) {
        $scope.path('/404');
      }
    });
  }
});
