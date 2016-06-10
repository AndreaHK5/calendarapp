Template.productsList.onRendered(function (){
    Tracker.afterFlush(function () { atgEventsAnimations.sizePageConteiners() });
});

Template.productsList.helpers({
    getAllProducts : function () {
        return products.find();
    }
});

Template.productsList.events({
    "click #create-button" : function () {
        atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
            Session.set("slideInBottom",true);
            Router.go("productUpsert");
        });
    },
    "click .product-card" : function () {
        var id = this._id;
        atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
            Session.set("slideInBottom",true);
            Router.go("productShow", {_id : id})
        });
    }
});