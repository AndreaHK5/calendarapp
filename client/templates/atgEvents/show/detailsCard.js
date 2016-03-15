Template.detailsCard.onRendered(function() {
    if (Session.get("scrollInBottom")) {
        atgEventsHelpers.scrollInBottom($("#event-details-container"));
        Session.set("scrollInBottom", undefined);
    }
})

Template.detailsCard.helpers({
    getDetailsCardTemplate : function () {
        return atgEventsHelpers.getTemplateForType(this.atgEventTypeId, "detailsCard");
    },

});

Template.detailsCard.events({
    // TODO add the keyenter 13 here
    "click .edit-event" : function () {
        var id = this._id;
        atgEventsHelpers.scrollOutTop($("#event-details-container")).then(function () {
            Router.go('eventEdit', { _id : id});
            Session.set("scrollInBottom", true);
        });
    },
    "click .back-to-calendar" : function () {
        atgEventsHelpers.scrollOutBottom($("#event-details-container")).then(function () {
            Router.go("atgEvents");
            Session.set("scrollInTop", true);
        });
    }
});