Template.eventEdit.onRendered(function () {

    // setting session to state.
    Session.set("eventDetails", this.data.eventDetails);
    Session.set("startDate", this.data.startDate);
    Session.set("endDate",this.data.endDate);
    Session.set("atgEventTypeId",this.data.atgEventTypeId);
    var relationshipIds = {};
    var partner = partners.findOne({events : this.data._id});
    relationshipIds.partnerId = partner ? partner._id : undefined;
    var product = products.findOne({events : this.data._id});
    relationshipIds.productId = product ? product._id : undefined;
    Session.set("eventRelationshipIds", relationshipIds);
    Session.set("formValid", false);

    this.autorun(function () {
        Session.get("formValid");
        Tracker.afterFlush(function () {
            if (Session.get("scrollInBottom")) {
                atgEventsHelpers.scrollInBottom($("#event-details-container"));
                Session.set("scrollInBottom", undefined);
                return;
            }
            if (Session.get("formValid")) {
                atgEventsHelpers.scrollInBottom($("#confirm-container"));
            } else {
                atgEventsHelpers.scrollInTop($("#event-details-container"));
            }
        })
    })
});

Template.eventEdit.helpers({
    getCalendarTemplate : function () {
        return atgEventsHelpers.getTemplateForType(Session.get("atgEventTypeId"), "editCalendar");
    },
    getDetailsEditTemplate : function()  {
        return atgEventsHelpers.getTemplateForType(Session.get("atgEventTypeId"), "createDetails");
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
        return atgEventsHelpers.getTemplateForType(Session.get("atgEventTypeId"),"detailsCard");
    },
    // TODO delete this and DRY
    getEventDetails : function () {
        var ev = {};
        ev.atgEventTypeId = Session.get("atgEventTypeId");
        ev.eventDetails = Session.get("eventDetails");
        ev.startDate = Session.get("startDate");
        ev.endDate = Session.get("endDate");
        return ev;
    },
});

Template.eventEdit.events({
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
    "click .confirm-details" : function (event) {
        proceed()
    },
    "keydown .confirm-details" : function () {
        if (event.keyCode == 13) {
            proceed();
        }
    },
    "click .back-to-dash" : function () {
        atgEventsHelpers.scrollOutBottom(
            $("#event-details-container").add($("#confirm-container"))
        ).then(function () {
            Router.go("atgEvents")
        });
    },
    "keydown .back-to-dash" : function (event) {
        if (event.keyCode == 13) {
            atgEventsHelpers.scrollOutBottom(
                $("#event-details-container").add($("#confirm-container"))
            ).then(function () {
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
    atgEventsHelpers.scrollOutBottom($("#confirm-container")).then( function () {
        Session.set("formValid", false);
    })
}


function proceed() {

    $('.ui.form').form('validate form');
    if(!$('.ui.form').form('is valid')) { return; }

    atgEventsHelpers.scrollOutTop($("#event-details-container")).then(function () {
        Session.set("formValid", true);
    });
}

function saveEngagementHanlder(event) {
    event.preventDefault();
    // TODO roll all the evets info into a single session variable?
    var atgEvent = {};
    atgEvent._id = Router.current().params._id;
    atgEvent.startDate = Session.get('startDate');
    atgEvent.endDate = Session.get('endDate');
    atgEvent.eventDetails = Session.get("eventDetails");
    atgEvent.atgEventTypeId = Session.get("atgEventTypeId");

    upsertAtgEvent(
        atgEvent,
        Session.get("eventRelationshipIds") || {},
        function (err, res) {
            if (err) {
                sAlert.error("Woha, something went wrong" + (err));
            } else {
                sAlert.closeAll();
                sAlert.success("Event saved", {onRouteClose: false});
                // TODO rethink this arrow when the one in create is redone
                atgEventsHelpers.scrollOutTop($("#confirm-container")).then(function () {
                        Session.set("scrollInBottom", true);
                            Router.go("atgEvents");
                    }
                )
            }
        }
    );
}