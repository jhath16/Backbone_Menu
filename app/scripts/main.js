'use strict';

var FoodItem = Backbone.Model.extend({})

var Menu = Backbone.Collection.extend({
  initialize: function () {
    console.log("Collection created");
  },
  model:FoodItem
});

var CategoryView = Backbone.View.extend({
  initialize: function (options) {

  },

  render: function(){
    // $('.food-container').append(this.title);
  }
})

var FoodItemView = Backbone.View.extend({
  initialize: function () {
    console.log(this.collection);
    this.render();
  },

  template: _.template($('#food-template').text()),

  render: function() {
    $('.food-item').append(this.template(this.model));
  }
})


$(document).ready(function(){
var menuCollection = new Menu();
menuCollection.add(menu);

_.each(menuCollection.models, function (i) {
  // console.log(i.attributes);
});

_.each(menuCollection.models, function (i) {
  var categoryView = new CategoryView({collection: menuCollection});
  categoryView.render();
})

})
