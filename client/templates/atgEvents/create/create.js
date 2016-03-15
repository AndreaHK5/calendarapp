Template.eventCreate.onRendered(function () {

    this.autorun(function () {
        Session.get("endDate");
        Session.get("formValid");

        Tracker.afterFlush( function () {
            // animations are controlled here

            // proceed to details
            if (!atgEventsHelpers.datesMissing() && !Session.get("formValid") && Object.keys(Session.get("eventDetails")) == 0 ) {
                atgEventsHelpers.scrollInBottom($("#event-details-container"));
                return;
            }

            // back to details
            if (!atgEventsHelpers.datesMissing() && !Session.get("formValid") && Object.keys(Session.get("eventDetails")) != 0 ) {
                atgEventsHelpers.scrollInTop($("#event-details-container"));
                return;
            }

            // back to dates
            if (atgEventsHelpers.datesMissing() && Session.get("atgEventTypeId") && !Session.get("formValid")) {
                atgEventsHelpers.positionTrayAndCalendar();
                // TODO refactor this with a promise chained together (and also conside not using the display)
                $("#select-dates-container").css("display", "none");
                setTimeout(function () {
                    $("#select-dates-container").css("display", "block");
                    atgEventsHelpers.scrollInTop($("#select-dates-container"));
                }, 10);
                return;
            }

            // proceed to confirmation
            if (Session.get("formValid")) {
                atgEventsHelpers.scrollInBottom($("#confirm-container"));
                return;
            }
        });
    })
});


Template.eventCreate.helpers({
    datesPresent : function () {
        return !atgEventsHelpers.datesMissing();
    },
    detailsMissing : function () {
        var detailsMissing = !Session.get("formValid");
        if (detailsMissing) {
            return true;
        } else {
            return false;
        }
    },
    getEventDetails : function () {
        var ev = {};
        ev.atgEventTypeId = Session.get("atgEventTypeId");
        ev.eventDetails = Session.get("eventDetails");
        ev.startDate = Session.get("startDate");
        ev.endDate = Session.get("endDate");
        return ev;
    },
    getCreateTemplate : function () {
        return atgEventsHelpers.getTemplateForType(Session.get("atgEventTypeId"),"createDetails");
    },
    getConfirmTemplate : function () {
        return atgEventsHelpers.getTemplateForType(Session.get("atgEventTypeId"),"detailsCard");
    },
    getStartDate : function () {
        return Session.get("startDate");
    },
    getEndDate : function () {
        return Session.get("endDate");
    }
});

Template.eventCreate.events({
    "click .reset-dates" : function (event) {
        resetEngagement(event);
    },
    "keydown .reset-dates" : function (event) {
        if (event.keyCode == 13) {
            resetEngagement(event);
        }
    },
    "click .reset-details" : function () {
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
    "submit .ui.form" : function (event) {
        event.preventDefault();
        clearValidations();
    }
});

function backToDetails () {
    atgEventsHelpers.scrollOutBottom($("#confirm-container")).then( function () {
        Session.set("formValid", false);
    })
}


function proceed() {
    // in case there is a value in the goals, this needs to be included in the engagement object

    $('.ui.form').form('validate form');
    if(!$('.ui.form').form('is valid')) { return };


    atgEventsHelpers.scrollOutTop($("#event-details-container")).then( function (){
        Session.set("formValid", true);
    });
}

function resetEngagement (event) {
    event.preventDefault();
    // TODO chain promises pleas!!
    atgEventsHelpers.scrollOutBottom($("#confirm-container").add($("#event-details-container"))).then( function () {
        atgEventsHelpers.resetSessionForCreate(true);
    });
    sAlert.warning("Let's start again!");
}


function saveEngagementHanlder(event) {
    event.preventDefault();
    var atgEvent = {};
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
                // TODO rethink this arrow
                atgEventsHelpers.scrollOutTop($("#confirm-container")).then(function () {
                    atgEventsHelpers.resetSessionForDash();
                        Session.set("scrollInBottom", true);
                        if (Router.current().route.getName() != "atgEvents") {
                            Router.go("atgEvents");
                        }
                    }
                )
            }
        }
    );
}