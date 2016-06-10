Template.atgEventShow.onRendered(function() {
    atgEventsAnimations.sizePageConteiners();
});

Template.atgEventShow.helpers({
    getDetailsCardTemplate : function () {
        return atgEventsTemplateHelpers.getTemplateForType(this.atgEventTypeId, "detailsCard");
    },
    getEventType : function () {
        if (!("atgEventTypeId" in this)) { return; }
        return atgEventTypes.findOne({_id : this.atgEventTypeId}).type;
    },
    createdByUser : function () {
        return Meteor.userId() == this.createdBy;
    }
});

Template.atgEventShow.events({
    // TODO add the keyenter 13 here
    "click .edit-event" : function () {
        var id = this._id;
        atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
            Router.go('atgEventEdit', { _id : id});
            Session.set("slideInBottom", true);
        });
    },
    "click .back-to-calendar" : function () {
        atgEventsAnimations.slideOutBottom($("#slidable-container")).then(function () {
            Router.go("atgEvents");
            Session.set("slideInTop", true);
        });
    },
    "click .delete-event" : function () {
        var id = this._id;
        $('.delete-event-modal').modal({
                onApprove : function () {
                    atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
                        removeAtgEvent(id, function (err, res) {
                            if (err) {
                                sAlert.error("Woha, somethign went wrong trying to delete this event " + err.error);
                            } else {
                                sAlert.warning("Engagement deleted!");
                                Router.go("atgEvents");
                                Session.set("slideInBottom", true);
                            }
                        });
                    })
                }
            })
            .modal('show');
    }
});