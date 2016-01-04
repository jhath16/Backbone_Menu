'use strict';

var FoodItem = Backbone.Model.extend({})

var Menu = Backbone.Collection.extend({
  initialize: function () {
  },
  model:FoodItem
});

var KitchenOrder = Backbone.Firebase.Collection.extend({
  firebase:'https://jhath16.firebaseio.com/',

  model:FoodItem
});

var Orders = Backbone.Collection.extend({
  initialize: function () {
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
    'click .submit-button': 'checkOut'
  },

  checkOut: function () {
    var kitchenOrder = new KitchenOrder();
    kitchenOrder.add(orders.models);
    kitchenOrder.sync();
    orders.reset();
    orders.updateSummary();
    alert('Your order has been submitted.');
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
  className:'item',
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
  template: _.template($('#food-template').text()),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    $('.food-container').append(this.el);
    return this;
  },

  events: {
    'click .button' : 'addToOrder'
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

var menu = [{
  category:'salads',
  title:'House Salad',
  description:'Organic Spring mix, and mixed green lettuce, cucumber, carrot, and crispy wonton.',
  price:6,
  img_url:'http://www.sushirockboca.com/wp-content/uploads/2011/07/Sushi-Rock-11-212x213.jpg',
}, {
  category:'salads',
  title:'Aloy Salad',
  description:'Grilled chicken, Fried Chicken, or Fried shrimp, Organic spring mix, tomato, cucumber and mixed green salad. All the dressing are gluten free.',
  price:9,
  img_url:'http://media-cdn.tripadvisor.com/media/photo-s/02/29/b7/e2/salade-de-crevettes.jpg',
}, {
  category:'salads',
  title:'Yum Yum',
  description:'Choice of meat, green onion, onions, tomato,carrot and cucumber in a spicy Thai lime dressing. (Hot)',
  price:9,
  img_url:'https://d1ouk4tp1vcuss.cloudfront.net/remote/s3.amazonaws.com/ODNUploads/517b6148cf3008._Y_U_M_N_U_A_Y_PA181897web.jpg?width=75&mode=crop&v=1',
}, {
  category:'salads',
  title:'Nam Tok',
  description:'Sliced beef, pork or chicken with green onion, red onion and ground roasted rice mixed in a spicy Thai lime dressing and topped with mint leaves. (Hot)',
  price:9,
  img_url:'https://d1ouk4tp1vcuss.cloudfront.net/remote/s3.amazonaws.com/ODNUploads/517b60eb4643e10._N_A_M_T_O_K_PA181917_web.jpg?width=75&mode=crop&v=1',
}, {
  category:'salads',
  title:'Larb Salad',
  description:'Ground pork, beef or chicken with green onion, red onion and ground roasted rice mixed in a spicy Thai lime dressing and topped with mint leaves. (HOT)',
  price:9,
  img_url:'https://d1ouk4tp1vcuss.cloudfront.net/remote/s3.amazonaws.com/ODNUploads/517b60fd4d3179._L_A_A_B_S_A_L_A_D_PA181876_web.jpg?width=75&mode=crop&v=1',
}, {
  category:'soup',
  title:'Tom Kha',
  description:'Lemon grass, onion, cabbage, lime leaves, cilantro and mushroom in coconut milk soup topped with chili oil.',
  price:8,
  img_url:'http://www.bonappetit.com/wp-content/uploads/2013/08/tom-kha-gai-chicken-coconut-soup.jpg',
}, {
  category:'soup',
  title:'Tom Yum',
  description:'Lemon grass, fresh chili pepper, lime leaves, cilantro and mushroom in a spicy herbal soup.',
  price:8,
  img_url:'https://d1ouk4tp1vcuss.cloudfront.net/remote/s3.amazonaws.com/ODNUploads/517b59a5e8b31re_35._T_O_M_Y_U_M_PA181952.jpg?width=75&mode=crop&v=1',
}, {
  category:'curry',
  title:'Red Curry',
  description:'Red Thai curry with meat or tofu, Thai basil, bamboo shoots, carrot,zucchini and bell pepper cooked in coconut milk.',
  price:14,
  img_url:'https://d1ouk4tp1vcuss.cloudfront.net/remote/s3.amazonaws.com/ODNUploads/517c41f1c4bf021._R_E_D_C_U_R_R_Y_P_PA171482_re.jpg?width=75&mode=crop&v=1',
}, {
  category:'curry',
  title:'Green Curry',
  description:'Green Thai curry with meat or tofu, Thai basil, bamboo shoots, carrot,zucchini and bell pepper cooked in coconut milk.',
  price:14,
  img_url:'https://d1ouk4tp1vcuss.cloudfront.net/remote/s3.amazonaws.com/ODNUploads/517c422e28566re_22._G_R_E_E_N_C_U_R_R_Y_P_PA171443.jpg?width=75&mode=crop&v=1',
},
{
  category:'curry',
  title:'Panang Curry',
  description:'Panang curry with meat or tofu, carrot, Thai basil, bell pepper and broccoli cooked in thick coconut soup.',
  price:14,
  img_url:'https://d1ouk4tp1vcuss.cloudfront.net/remote/s3.amazonaws.com/ODNUploads/517c4277b6c91re_23._P_A_N_A_N_G_PA181732.jpg?width=75&mode=crop&v=1',
}, {
  category:'curry',
  title:'Yellow Curry',
  description:'Yellow curry with meat or tofu, potato and onion cooked in coconut milk and topped with fried onion.',
  price:14,
  img_url:'https://d1ouk4tp1vcuss.cloudfront.net/remote/s3.amazonaws.com/ODNUploads/517c42ced22ffre_24._G_A_E_N_G_G_A_R_E_E_PA181741.jpg?width=75&mode=crop&v=1',
}, {
  category:'curry',
  title:'Roast Chicken Curry',
  description:'Red Thai curry with roast chicken, pineapple, grapes, bell pepper, zucchini,carrot, tomato and Thai basil cooked in coconut milk.',
  price:14,
  img_url:'https://d1ouk4tp1vcuss.cloudfront.net/remote/s3.amazonaws.com/ODNUploads/517c439363877re_26._R_O_A_S_T_PA181820.jpg?width=75&mode=crop&v=1',
}, {
  category:'noodle',
  title:'Pad Thai',
  description:'Thin rice noodle stir-fried with meat or tofu, egg, green onion, chopped red onion, chopped tofu and bean sprouts in Pad Thai sauce topped with chopped peanuts.',
  price:13,
  img_url:'https://d1ouk4tp1vcuss.cloudfront.net/remote/s3.amazonaws.com/ODNUploads/517c46311dd4c28._P_A_D_T_H_A_I_PA181797.jpg?width=75&mode=crop&v=1',
}, {
  category:'noodle',
  title:'Pad See Eew',
  description:'Wide rice noodle stir-fried with meat and tofu,egg and broccoli in a sweet Thai brown sauce.',
  price:13,
  img_url:'https://d1ouk4tp1vcuss.cloudfront.net/remote/s3.amazonaws.com/ODNUploads/517c466d25cf3re_29._P_A_D_S_E_I_E_W_PA181808.jpg?width=75&mode=crop&v=1',
}, {
  category:'noodle',
  title:'Drunken Noodle',
  description:'Wide rice noodle stir-fried with fresh chili, Thai basil, onion and bell pepper in a spicy Thai sauce. Hot',
  price:13,
  img_url:'https://d1ouk4tp1vcuss.cloudfront.net/remote/s3.amazonaws.com/ODNUploads/517c46bc0c973re_30._D_R_U_N_K_E_N_PA181828.jpg?width=75&mode=crop&v=1',
}, {
  category:'noodle',
  title:'Thai Chef’s Noodle',
  description:'Wide rice noodle stir-fried with meat or tofu, onion, bell pepper, zucchini,broccoli and baby corn in a spicy Thai chili sauce (Thai chili sauce contains shrimp). Hot',
  price:13,
  img_url:'https://d1ouk4tp1vcuss.cloudfront.net/remote/s3.amazonaws.com/ODNUploads/51819ee05621d32._T_H_A_I_C_H_E_F%E2%80%99S_N_O_O_PA181985_web.jpg?width=75&mode=crop&v=1',
}, {
  category:'noodle',
  title:'Sriracha Noodle',
  description:'Thin rice noodle stir-fried with egg, tomato, bell pepper, broccoli, onion and green onion in Aloy’s special Sriracha sauce.Hot',
  price:13,
  img_url:'http://2.bp.blogspot.com/-quIFqQo3olo/Tbx7vV7GoII/AAAAAAAAAdk/GIr4EVc71rM/s1600/IMG_3754.JPG',
}, {
  category:'desert',
  title:'Coconut Custard',
  description:null,
  price:7,
  img_url:'https://d1ouk4tp1vcuss.cloudfront.net/remote/s3.amazonaws.com/ODNUploads/517b68241e617C_O_C_O_N_U_T_C_U_S_T_A_R_D_WEB.jpg?width=75&mode=crop&v=1',
}, {
  category:'desert',
  title:'Cheesecake Xangos (Gluten Free)',
  description:'Rich, smooth cheesecake, with a slight tangy finish, rolled in melt-in-your-mouth, flaky pastry tortilla.',
  price:7,
  img_url:'https://d1ouk4tp1vcuss.cloudfront.net/remote/s3.amazonaws.com/ODNUploads/54113f0115e2foriginal_cheesecake_xangos_online_2.jpg?width=75&mode=crop&v=1',
}, {
  category:'desert',
  title:'Fried Banana',
  description:null,
  price:6,
  img_url:'http://chezpim.typepad.com/photos/uncategorized/2008/12/01/friedbanana.jpg',
}];
var menuCollection = new Menu(menu);

var categories = [{
  name:'Salads',
  id:'salads',
  default:true
}, {
  name:'Soup',
  id:'soup',
  default:false
}, {
  name:'Curry',
  id:'curry',
  default:false
}, {
  name:'Noodle',
  id:'noodle',
  default:false
}, {
  name:'Dessert',
  id:'desert',
  default:false
}];
var categoryCollection = new CategoryCollection(categories);
