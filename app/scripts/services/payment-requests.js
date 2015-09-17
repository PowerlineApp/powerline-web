'use strict';

angular.module('app').factory('paymentRequests', function ($http, serverUrl, api, JsModel, JsCollection, EducationContextCollection, UserModel) {

  var PaymentRequest = JsModel.extend({
    parsers: {
      published_at: 'date',
      educational_context: function (data) {
        return new EducationContextCollection(data);
      },
      user: function (data) {
        return new UserModel(data);
      }
    },
    canAnswer: function () {
      return !(this.get('is_answered') || this.get('is_crowdfunding_deadline'));
    },
    answer: function (data) {
      return $http.post(serverUrl + '/api/poll/question/' + this.get('id') + '/answer/add',
        angular.element.param(data), {headers: {'Content-Type':'application/x-www-form-urlencoded'}});
    }
  });

  return {
    loadOne: function (id) {
      return $http.get(serverUrl + api.getUriPath('paymentRequest') + id).then(function (response) {
        return new PaymentRequest(response.data);
      });
    }
  };
});
