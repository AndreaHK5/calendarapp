Template.atgEventBriefCard.helpers({
    getBriefCardTemplate : function () {
        return atgEventsTemplateHelpers.getTemplateForType(this.atgEventTypeId, "briefCard");
    },
    getDetailsCardTemplate : function () {
        return atgEventsTemplateHelpers.getTemplateForType(this.atgEventTypeId, "detailsCard");
    },
    isSelectedEvent : function (id) {
        if(!Session.get("engagementOnCalendar")) { return }
        return Session.get("engagementOnCalendar")._id == id;
    },
    isCreator : function () {
        return Meteor.user() && this.createdBy == Meteor.userId();
    },
    onDash : function () {
        return Router.current().route.getName() == "atgEvents";
    }
});

Template.atgEventBriefCard.events({
    "click .detail-page" : function () {
        var id = this._id;
        atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
            Session.set("slideInBottom", true);
            Session.set('dayForEventsDetail', undefined);
            Router.go('atgEventShow', { _id : id});
        });
    }
});