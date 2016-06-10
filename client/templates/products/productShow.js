Template.productShow.onRendered(function () {
    Tracker.afterFlush( function () {
        $('.ui.image').popup();
    });
    Tracker.afterFlush(function () { atgEventsAnimations.sizePageConteiners() });
});

Template.productShow.helpers({
    getCompanyName: function (id) {
        return partners.findOne({_id : id}).companyName;
    },
    getPersonData : function (id) {
        return people.findOne({_id : id});
    },
    showButtons : function () {
        return Router.current().route.getName() == "productShow";
    }
});

Template.productShow.events({
    "click .product-list" : function () {
        atgEventsAnimations.slideOutBottom($("#slidable-container")).then(function () {
            Router.go("productsList");
            Session.set("slideInTop", true);
        });
    },
    "click .edit-product" : function () {
        var _id = this._id;
        atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
            Router.go("productEdit", { _id : _id});
            Session.set("slideInBottom", true);
        });
    },
    "click .delete-product" : function (){
        var id = this._id;
        $('.delete-modal').modal({
                onApprove : function () {

                    Meteor.call("deleteProduct", id, function (err, res) {
                        if (err) {
                            sAlert.error("Woha, something went wrong " + err);
                            return;
                        }
                        atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
                            Session.set("slideInBottom", true);
                            Router.go("productsList");
                        });
                        sAlert.info("Product deleted");
                    })
                },
            })
            .modal('show');
    }
});