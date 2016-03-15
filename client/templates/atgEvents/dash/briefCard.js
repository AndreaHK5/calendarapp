Template.briefCard.helpers({
    getBriefCardTemplate : function () {
        return atgEventsHelpers.getTemplateForType(this.atgEventTypeId, "briefCard");
    },
    isSelectedEvent : function (id) {
        if(!Session.get("engagementOnCalendar")) { return }
        return Session.get("engagementOnCalendar")._id == id;
    },
    isCreator : function () {
        return Meteor.user() && this.createdBy == Meteor.userId();
    },
});

Template.briefCard.events({
    "click .detail-page" : function () {
        var id = this._id;
        atgEventsHelpers.scrollOutTop($("#dayengagements-container").add($("#select-dates-container"))).then(function () {
            Session.set("scrollInBottom", true);
            Router.go('eventShow', { _id : id});
        });

    },
    "click .edit-event" : function () {
        var id = this._id;
        atgEventsHelpers.scrollOutTop($("#dayengagements-container").add($("#select-dates-container"))).then(function () {
            Session.set("scrollInBottom", true);
            Router.go('eventEdit', { _id : id});
        });
    },
    "click .open-details-modal" : function () {
        $('#' + this._id + '.details-modal').modal('show');
    }
})