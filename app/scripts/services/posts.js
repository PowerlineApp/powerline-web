'use strict';

angular.module('app').factory('posts', function ($http, serverUrl, JsCollection, JsModel) {
  var Post = JsModel.extend({
    parsers: {
      created_at:'date'
    }
  });

  var posts = new JsCollection([], {model: Post});

  posts.load = function () {
    return $http.get(serverUrl + '/api-public/posts/').then(function (response) {
      return posts.reset().add(response.data);
    });
  };

  return posts;
});

