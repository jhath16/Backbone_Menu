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
    console.log(this.collection.models[0].attributes);
    this.render();

  },

  template: _.template($('#food-template').text()),

  render: function() {
    $('.food-container').append(this.template(this.model));
  }
})


$(document).ready(function(){
var menuCollection = new Menu();
menuCollection.add(menu);

_.each(menuCollection.models, function (i) {
  var foodItemView = new FoodItemView({collection: menuCollection});
  foodItemView.render();
})

})
