Template.atgEventShowProduct.helpers({
    getProduct : function () {
        // this._id means the event is already save in db
        var eventId = this._id;
        var relIds = Session.get("eventRelationshipIds");

        if (!eventId && !relIds){ return; }

        if (eventId) {
            return products.findOne({events : eventId});
        } else {
            return products.findOne({ _id : relIds.productId});
        }
    },
});


