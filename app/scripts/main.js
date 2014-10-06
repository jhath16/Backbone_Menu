'use strict';

var FoodItem = Backbone.Model.extend({})

var Menu = Backbone.Collection.extend({
  initialize: function () {
    console.log("Collection created");
  },
  model:FoodItem
});

var KitchenOrder = Backbone.Firebase.Collection.extend({
  firebase:'https://jhath16.firebaseio.com/',

  model:FoodItem
});

var Orders = Backbone.Collection.extend({
  initialize: function () {
    console.log("Collection created");
    this.listenTo(this, 'add remove', this.updateSummary);
  },

  model:FoodItem,

  updateSummary: function() {
    $('.order-items').empty();
    _.each(orders.models, function(i) {
      new OrderSummaryView({model:i}).render();
    })
    orderTotalView.render();
  }
});

var OrderTotalView = Backbone.View.extend({
  template: _.template($('#order-total').text()),

  render: function() {
    this.$el.html(this.template({total: this.total()}));
    $('.order-total').append(this.el);
  },

  events: {
    'click button': 'checkOut'
  },

  checkOut: function () {
    var kitchenOrder = new KitchenOrder();
    kitchenOrder.add(orders.models);
    kitchenOrder.sync();
    orders.reset();
    orders.updateSummary();
    alert('Thank you for choosing Majestic Thai. Your order has been submitted.');
  },

  total: function() {
    var total = 0;
    _.each(orders.models, function(i) {
      total += i.get('price');
    })
    return total;
  }
});

var OrderSummaryView = Backbone.View.extend({
  initialize: function() {
    console.log(this.model);
  },

  template:_.template($('#order-template').text()),

  render:function() {
    this.$el.html(this.template(this.model.toJSON()));
    $('.order-items').append(this.el);
  },

  removeFromOrder: function() {
    orders.remove(this.model);
  },

  events: {
    "click .remove":"removeFromOrder"
  }
});

var Category = Backbone.Model.extend({});

var CategoryCollection = Backbone.Collection.extend({
  initialize: function () {
    console.log("Collection created");
  },
  model:Category
});

var CategoryView = Backbone.View.extend({
  className:'category-title',
  
  render: function(){
    this.$el.html(this.model.get('name'));
    $('.categories').append(this.el);
    return this;
  },

  events: {
    "click":"displayFoodType"
  },

  displayFoodType: function() {
    $('.food-container').empty();
    var filteredFoodItems = menuCollection.where({category: this.model.get('id')});

    _.each(filteredFoodItems, function (i) {
      new FoodItemView({model:i}).render();
    })
  }
})

var FoodItemView = Backbone.View.extend({
  initialize: function () {
    console.log(this);
  },

  template: _.template($('#food-template').text()),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    $('.food-container').append(this.el);
    return this;
  },

  events: {
    'click button' : 'addToOrder'
  },

  addToOrder: function() {
    orders.add(this.model.toJSON());
  }
})

var orders = new Orders();
var orderTotalView = new OrderTotalView();

$(document).ready(function(){
  _.each(categoryCollection.models, function(i) {
    var cv = new CategoryView({model:i}).render();
    if(i.get('default') === true)
      cv.displayFoodType();
  })
})
