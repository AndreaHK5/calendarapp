Template.atgEventEdit.onRendered(function () {

    // setting session to state.
    Session.set("newAtgEvent", this.data);
    var relationshipIds = {};
    var partner = partners.findOne({events : this.data._id});
    relationshipIds.partnerId = partner ? partner._id : undefined;
    var product = products.findOne({events : this.data._id});
    relationshipIds.productId = product ? product._id : undefined;
    Session.set("eventRelationshipIds", relationshipIds);
    Session.set("formValid", false);

    atgEventsAnimations.sizePageConteiners();
});

Template.atgEventEdit.helpers({
    getCalendarTemplate : function () {
        return atgEventsTemplateHelpers.getTemplateForType(this.atgEventTypeId, "editCalendar");
    },
    getDetailsEditTemplate : function()  {
        return atgEventsTemplateHelpers.getTemplateForType(this.atgEventTypeId, "createDetails");
    },
    getTeamTemplate : function () {
        if (!Session.get("newAtgEvent")) { return; }
        return atgEventsTemplateHelpers.getTemplateForType(Session.get("newAtgEvent").atgEventTypeId, "teamSelection");
    },
    detailsMissing : function () {
        var detailsMissing = !Session.get("formValid");
        if (detailsMissing) {
            return true;
        } else {
            return false;
        }
    },
    getConfirmTemplate : function () {
        return atgEventsTemplateHelpers.getTemplateForType(this.atgEventTypeId, "detailsCard");
    },
    // TODO delete this and DRY
    getEventDetails : function () {
        return Session.get("newAtgEvent");
    },
});

Template.atgEventEdit.events({
    "click .reset-details" : function (event) {
        backToDetails();
    },
    "keydown .reset-details" : function (event) {
        if (event.keyCode == 13) {
            backToDetails();
        }
    },
    "click .save-engagement" : function (event) {
        saveEngagementHanlder(event);
    },
    "keydown .save-engagement" : function (event) {
        if ( event.keyCode == 13) {
            saveEngagementHanlder(event);
        }
    },
    "click .proceed" : function (event) {
        proceed()
    },
    "keydown .proceed" : function () {
        if (event.keyCode == 13) {
            proceed();
        }
    },
    "click .back-to-dash" : function () {
        atgEventsAnimations.slideOutBottom( $("#slidable-container") ).then(function () {
            Session.set("slideInBottom", true);
            Router.go("atgEvents")
        });
    },
    "keydown .back-to-dash" : function (event) {
        if (event.keyCode == 13) {
            atgEventsAnimations.slideOutBottom( $("#slidable-container") ).then(function () {
                Session.set("slideInBottom", true);
                Router.go("atgEvents");
            });
        }
    },
    "submit .ui.form" : function (event) {
        event.preventDefault();
        clearValidations();
    },
});


// TODO  these are shared between create and edit - DRY
function backToDetails () {
    sAlert.info("Ok, we can still amend the details.");
    atgEventsAnimations.slideOutBottom($("#slidable-container")).then( function () {
        Session.set("formValid", false);
        atgEventsAnimations.slideInTop($("#slidable-container"));
    });
}


function proceed() {
    $('.ui.form').form('validate form');
    if(!$('.ui.form').form('is valid')) { return; }

    sAlert.info("Great, let's review the details and in case confirm.");
    atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
        Session.set("formValid", true);
        atgEventsAnimations.slideInBottom($("#slidable-container"));
    });
}

function saveEngagementHanlder(event) {
    event.preventDefault();
    // TODO roll all the evets info into a single session variable?
    var atgEvent = Session.get("newAtgEvent");

    upsertAtgEvent(
        atgEvent,
        Session.get("eventRelationshipIds") || {},
        function (err, res) {
            if (err) {
                sAlert.error("Woha, something went wrong" + (err));
            } else {
                sAlert.closeAll();
                sAlert.success("Event updated", {onRouteClose: false});
                // TODO rethink this arrow when the one in create is redone
                atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
                        Session.set("slideInBottom", true);
                        Router.go("atgEvents");
                    }
                )
            }
        }
    );
}