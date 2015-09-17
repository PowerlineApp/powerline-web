'use strict';

angular.module('app', [
  'appConfig',
  'ngSanitize',
  'ngRoute',
  'socialLinks',
  'btford.markdown',
  'JsCollection'
]).config(function ($routeProvider, $locationProvider) {
	
	  $locationProvider.html5Mode(true);
	
	
    $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/404', {
      templateUrl: 'views/404.html'
    })
    .when('/reset-password/:token', {
      templateUrl: 'views/session/reset-password.html',
      controller: 'ResetPasswordCtrl'
    })
    .when('/thank', {
      templateUrl: 'views/session/thank.html'
    })
    .when('/petition/:id', {
      templateUrl: 'views/petitions/petition.html',
      controller: 'PetitionCtrl'
    })
    .when('/payment-request/:id', {
      templateUrl: 'views/payment-requests/payment-request.html',
      controller: 'PaymentRequestCtrl'
    })
    .when('/terms', {
      templateUrl: 'views/static/terms.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main';
      }
    })
    .when('/privacy', {
      templateUrl: 'views/static/privacy.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main info-page';
      }
    })
    .when('/copyright', {
      templateUrl: 'views/static/copyright.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main info-page';
      }
    })
	.when('/contact-us', {
      templateUrl: 'views/contact-us.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main info-page';
      }
    })
	.when('/more-information', {
      templateUrl: 'views/more-information.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main info-page';
      }
    })
	.when('/general-faq', {
      templateUrl: 'views/support/faq.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main info-page';
      }
    })
    .when('/contacts', {
      templateUrl: 'views/contacts.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main';
      }
    })
	.when('/about/our-team', {
      templateUrl: 'views/about/our-team.html ',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main info-page';
      }
    })
	.when('/community-guidelines', {
      templateUrl: 'views/fine-print/community-guidelines.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main info-page';
      }
    })
	.when('/terms-conditions', {
      templateUrl: 'views/fine-print/terms-conditions.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main info-page';
      }
    })
	.when('/registration', {
      templateUrl: 'views/group-start.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main info-page';
      }
    })
	.when('/registration/group-registration', {
      templateUrl: 'views/group-registration.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main style-registration';
      }
    })
	.when('/registration/group-tier-selection', {
      templateUrl: 'views/tier-selection.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main style-registration';
      }
    })
	.when('/registration/group-payment', {
      templateUrl: 'views/group-payment.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main group-payment style-registration';
      }
    })

	.when('/registration/group-membership-settings', {
      templateUrl: 'views/group-membership-settings.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main style-registration';
      }
    })
	
	.when('/registration/group-settings', {
      templateUrl: 'views/group-settings.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main style-registration';
      }
    })
	.when('/registration/group-advanced-settings', {
      templateUrl: 'views/group-advanced-settings.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main style-registration';
      }
    })
	.when('/registration/group-confirmation', {
      templateUrl: 'views/group-confirmation.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main style-registration';
      }
    })

	.when('/user-profile', {
      templateUrl: 'views/user/user-info.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main leader-profile';
      }
    })
	.when('/action2015', {
      templateUrl: 'views/action2015/action2015.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main style-registration';
      }
    })
	.when('/action2015/share', {
      templateUrl: 'views/action2015/action2015-sharing.html',
      controller: function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main style-registration';
      }
    })
    .otherwise({
      redirectTo: '/404'
    });

	

  }).run(function ($rootScope, $location, layout, adminUrl, flurry) {
  $rootScope.path = function (path) {
    return $location.path(path);
  };
  $rootScope.execApply = function () {
    if ($rootScope.$$phase !== '$apply' && $rootScope.$$phase !== '$digest') {
      $rootScope.$apply();
    }
  };
  $rootScope.layout = layout;
  $rootScope.$on('$routeChangeSuccess', function () {
    layout.reset();
  });
  $rootScope.adminUrl = adminUrl;

	

});




