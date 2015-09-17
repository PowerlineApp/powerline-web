'use strict';

angular.module('app').factory('others', function ($http, serverUrl, JsCollection, JsModel) {
  var Other = JsModel.extend({
    parsers: {
      created_at:'date'
    }
  });

  var others = new JsCollection([], {model: Other});

  others.load = function () {
    return $http.get(serverUrl + '/api-public/posts/').then(function (response) {
      return others.reset().add(response.data);
    });
  };

  return others;
});






