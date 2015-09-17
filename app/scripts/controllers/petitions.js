'use strict';

angular.module('app').controller('PetitionCtrl', function ($scope, $routeParams, petitions) {
  $scope.loading = true;
  $scope.data = {
    is_agree_terms: true,
    privacy: false
  };
  petitions.loadOne($routeParams.id).then(function (petition) {
    $scope.petition = petition;
    $scope.loading = false;
  }, function (response) {
    $scope.loading = false;
    if (404 === response.status) {
      $scope.path('/404');
    }
  });
  $scope.loading_comments = true;
  petitions.loadComments($routeParams.id).then(function (data) {
    $scope.loading_comments = false;
    $scope.comment = data.root;
    $scope.comments_count = data.comments_count;
  }, function () {
    $scope.loading_comments = false;
  });
}).controller('SignPetitionCtrl', function ($scope, petitions, session, flurry) {
  $scope.is_overlay_visible = false;
  $scope.is_login_form_visible = false;
  $scope.loading = false;

  $scope.hideOverlay = function () {
    $scope.is_overlay_visible = false;
    $scope.is_login_form_visible = false;
    $scope.loading = false;
  };

  $scope.openLoginForm = function () {
    $scope.is_overlay_visible = true;
    $scope.is_login_form_visible = true;
  };

  $scope.sign = function (loginFormScope) {
    petitions.loadOne($scope.petition.id).then(function (petition) {
      $scope.hide_sign_form = true;
      if(petition.is_answered) {
        return finishSign(loginFormScope, 'You have already signed the petition', true);
      }
      petitions.sign(petition, $scope.data.privacy).then(function () {
        $scope.petition.options[0].votes_count++;
        finishSign(loginFormScope, 'Signed', false);
        flurry.log('petition signed', {id: petition.id});
      }, function (response) {
        if (403 === response.status) {
          finishSign(loginFormScope, 'You are not allowed to sign this petition', true);
        } else {
          $scope.hide_sign_form = false;
          finishSign(loginFormScope, 'Error occurred', true);
        }
      });
    });
  };

  $scope.signWithFacebook = function () {
    $scope.is_overlay_visible = true;
    $scope.loading = true;
    session.loginWithFacebook().then(function () {
      $scope.sign();
    }, function (error) {
      finishSign(null, error, true);
    });
  };

  function finishSign(loginFormScope, message, isError) {
    if (loginFormScope) {
      loginFormScope.loading = false;
    }
    $scope.is_overlay_visible = false;
    $scope.is_login_form_visible = false;
    $scope.is_sign_error = isError;
    $scope.sign_message = message;
    $scope.loading = false;
  }
});
