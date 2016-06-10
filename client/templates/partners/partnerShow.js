Template.partnerShow.onRendered(function () {
    Tracker.afterFlush(function () {
        atgEventsAnimations.sizePageConteiners();
    })
});

Template.partnerShow.helpers({
    getEvents : function () {
        if (this.events) { 
            return atgEvents.find({ _id : { "$in" : this.events}});
        }
    },
    primaryLocations : function () {
        return _.where(this.locations, {isPrimaryLocation : true});
    },
    otherLocations : function () {
        return _.where(this.locations, {isPrimaryLocation : false});
    },
    getPartnerTypes : function () {
        if (this.partnerTypeIds) {
            return partnerTypes.find({ _id : { "$in" : this.partnerTypeIds}});
        }
    }
});

Template.partnerShow.events({
    "click .back" : function () {
        atgEventsAnimations.slideOutBottom($("#slidable-container")).then(function () {
            Router.go("partnersList");
            Session.set("slideInTop", true);
        });
    },
    "click .edit" : function () {
        var _id = this._id;
        atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
            Router.go("partnerEdit", {_id : _id});
            Session.set("slideInBottom", true);
        });
    },
    "click .delete" : function () {
        var id = this._id;
        $('.delete-modal').modal({
                onApprove : function () {
                    Meteor.call("deletePartner", id, function (err, res) {
                        if (err) {
                            sAlert.error("Woha, something went wrong " + err);
                            return;
                        }
                        atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
                            Session.set("slideInBottom", true);
                            Router.go("partnersList");
                        });
                        sAlert.info("Partner deleted");
                    })
                },
            })
            .modal('show');
    }
});