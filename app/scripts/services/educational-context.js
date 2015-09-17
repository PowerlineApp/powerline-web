'use strict';

angular.module('app').factory('EducationContextCollection', function (JsModel, JsCollection, youtube) {
  var EducationContextModel = JsModel.extend({
    getPreview: function () {
      if ('video' === this.get('type')) {
        return this.get('preview') ? this.get('preview') : this._setPreview();
      }
    },
    _setPreview: function () {
      this.set('preview', youtube.generatePreviewLink(youtube.parseId(this.get('text'))));
      return this.get('preview');
    }
  });

  return JsCollection.extend({
    model: EducationContextModel,
    byTypes: {},
    sort: function () {
      this.byTypes = {};
      var self = this;
      this.each(function (model) {
        var type = model.get('type');
        if (!self.byTypes[type]) {
          self.byTypes[type] = [];
        }
        self.byTypes[type].push(model);
      });
    }
  });
});
