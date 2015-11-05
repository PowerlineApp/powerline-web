'use strict';

angular.module('app').factory('petitions', function ($http, serverUrl, youtube, api) {
  function format(item) {
    item.published_at_date = new Date(item.published_at);
    item.educationalContextByTypes = {};
    _(item.educational_context).each(function (ec_item) {
      if (!item.educationalContextByTypes[ec_item.type]) {
        item.educationalContextByTypes[ec_item.type] = [];
      }
      if (ec_item.type === 'video') {
        ec_item.preview = youtube.generatePreviewLink(youtube.parseId(ec_item.text));
      }
      item.educationalContextByTypes[ec_item.type].push(ec_item);
    });
    return item;
  }

  function buildTree(data) {
    var root,
      byId = {}
        ;
    _(data).each(function (item) {
      item.children = [];
      item.created_at_date = new Date(item.created_at);
      byId[item.id] = item;
      if (!item.parent_comment) {
        root = item;
      }
      if (item.privacy === 1) {
        item.user = {
          username: 'Someone'
        };
      }
    });

    _(data).each(function (item) {
      if (byId[item.parent_comment]) {
        byId[item.parent_comment].children.push(item);
        item.parent = byId[item.parent_comment];
      }
    });

    _(byId).each(function (item) {
      item.children = _(item.children).sortBy(function (child) {
        return child.created_at_date.getTime();
      });
    });

    return {root: root, byId: byId, comments_count: data.length - 1};
  }

  return {
    loadOne: function (id) {
      return $http.get(serverUrl + api.getUriPath('petition') + id).then(function (response) {
        return format(response.data);
      });
    },

    loadComments: function (id) {
      return $http.get(serverUrl + api.getUriPath('petition') + id + '/comments').then(function (response) {
        return buildTree(response.data);
      });
    },

    sign: function (petition, privacy) {
      var data = {
        option_id: petition.options[0].id,
        privacy: Number(privacy),
        comment: ''
      };
      return $http.post(serverUrl + '/api/poll/question/' + petition.id + '/answer/add', angular.element.param(data), {headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }});
    }
  };
});
