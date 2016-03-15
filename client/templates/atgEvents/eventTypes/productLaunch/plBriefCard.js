Template.plBriefCard.helpers({
    getProduct : function () {
        return products.findOne({events : this._id} );
    },
});