function notLoggedIn() {
    if (!Meteor.userId()) {
        sAlert.error("must be logged in");
        this.render('notLoggedIn');
    } else {
        this.next();
    }
}

ProductsListController = RouteController.extend({
    template : "productsList",
    subscriptions: function(){
        return [
            Meteor.subscribe("publishers"),
            Meteor.subscribe("developers"),
            Meteor.subscribe("allProducts"),
            Meteor.subscribe("engineers"),
            Meteor.subscribe("dams")
        ];
    }
});

ProductShowController = RouteController.extend({
    template : "productShow",
    data : function () {
        var product = products.findOne({ _id : this.params._id});
        if (!product) {
            this.render('notFound');
        } else {
            return product;
        }
    },
    subscriptions: function(){
        return [
            Meteor.subscribe("publishers"),
            Meteor.subscribe("developers"),
            Meteor.subscribe("allProducts"),
            Meteor.subscribe("engineers"),
            Meteor.subscribe("dams")
        ];
    }
});

ProductCreateController = RouteController.extend({
    template : "productUpsert",
    subscriptions: function(){
        return [
            Meteor.subscribe("publishers"),
            Meteor.subscribe("developers"),
            Meteor.subscribe("partnerTypes"),
            Meteor.subscribe("allProducts"),
            Meteor.subscribe("engineers"),
            Meteor.subscribe("dams")
        ];
    },
    onBeforeAction : notLoggedIn
});

ProductEditController = RouteController.extend({
    template : "productUpsert",
    data : function () {
        var product = products.findOne({ _id : this.params._id});
        if (!product) {
            this.render('notFound');
        } else {
            return product;
        }
    },
    subscriptions: function(){
        return [
            Meteor.subscribe("publishers"),
            Meteor.subscribe("developers"),
            Meteor.subscribe("partnerTypes"),
            Meteor.subscribe("allProducts"),
            Meteor.subscribe("engineers"),
            Meteor.subscribe("dams")
        ];
    },
    onBeforeAction : notLoggedIn
});