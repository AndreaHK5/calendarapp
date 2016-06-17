Template.atgEventCreate.onRendered(function () {

    Session.set("newAtgEvent", {
        atgEventTypeId : this.data._id,
        eventDetails : {},
        startDate : undefined,
        endDate: undefined
    });

    // TODO find a way to commoditize this
    this.autorun(function (){
        Session.get("slideInBottom");
        Session.get("slideInTop");
        Tracker.afterFlush( function () {
            atgEventsAnimations.sizePageConteiners();
        })
    });

    this.autorun( function () {
        Session.get("newAtgEvent");
        atgEventsAnimations.sizeToUsableArea($("#slidable-container"));
    });

    $(window).resize(function() {
        // this is the only calendar that does need the select dates container to scroll
        atgEventsAnimations.sizeToUsableArea($("#slidable-container"));
    });

    Session.set("currentStep", atgEventsTemplateHelpers.createSteps.selectTeam);
});

Template.atgEventCreate.helpers({
    onTeamSelection : function () {
        if (!Session.get("newAtgEvent")) { return; }
        if(!atgEventsTemplateHelpers.getTemplateForType(Session.get("newAtgEvent").atgEventTypeId, "teamSelection") && Session.get("currentStep") == atgEventsTemplateHelpers.createSteps.selectTeam) {
            // if no template is present for team selection
            Session.set("currentStep", atgEventsTemplateHelpers.createSteps.selectDates);
            return;
        }
        return Session.get("currentStep") == atgEventsTemplateHelpers.createSteps.selectTeam;
    },
    onDatesSelection: function () {
        return Session.get("currentStep") == atgEventsTemplateHelpers.createSteps.selectDates;
    },
    onDetails: function () {
        return Session.get("currentStep") == atgEventsTemplateHelpers.createSteps.details;
    },
    onConfirm : function () {
        return Session.get("currentStep") == atgEventsTemplateHelpers.createSteps.confirm;
    },
    fullCalendar : function () {
        var newEvent = Session.get("newAtgEvent");
        if(!newEvent) { return; }
        return !newEvent.endDate &&
            Session.get("currentStep") == atgEventsTemplateHelpers.createSteps.selectDates &&
            atgEventsTemplateHelpers.getTemplateForType(Session.get("newAtgEvent").atgEventTypeId, "calendar") == "atgEventsCalendar";
    },
    getTeamTemplate : function () {
        if (!Session.get("newAtgEvent")) { return; }
        return atgEventsTemplateHelpers.getTemplateForType(Session.get("newAtgEvent").atgEventTypeId, "teamSelection");
    },
    getCalendarTemplate : function (){
        if (!Session.get("newAtgEvent")){return;}
        if (Session.get("newAtgEvent").startDate && Session.get("newAtgEvent").endDate ) {
            return atgEventsTemplateHelpers.getTemplateForType(Session.get("newAtgEvent").atgEventTypeId, "editCalendar");
        }
        return atgEventsTemplateHelpers.getTemplateForType(Session.get("newAtgEvent").atgEventTypeId, "calendar");
    },
    getCreateTemplate : function () {
        if (!Session.get("newAtgEvent")) { return; }
        return atgEventsTemplateHelpers.getTemplateForType(Session.get("newAtgEvent").atgEventTypeId, "createDetails");
    },
    getConfirmTemplate : function () {
        return atgEventsTemplateHelpers.getTemplateForType(Session.get("newAtgEvent").atgEventTypeId, "detailsCard");
    },
    getEventDetails : function () {
        return Session.get("newAtgEvent");
    },
});

Template.atgEventCreate.events({
    "click .reset-team" : function () {
        if(Session.get("currentStep") == atgEventsTemplateHelpers.createSteps.selectTeam) { return; }
        goBackToStep(atgEventsTemplateHelpers.createSteps.selectTeam);
    },
    "click .reset-dates" : function () {
        if(Session.get("currentStep") <= atgEventsTemplateHelpers.createSteps.selectDates) { return; }
        goBackToStep(atgEventsTemplateHelpers.createSteps.selectDates);
    },
    "click .reset-details" : function () {
        if(Session.get("currentStep") <= atgEventsTemplateHelpers.createSteps.details) { return; }
        goBackToStep(atgEventsTemplateHelpers.createSteps.details);
    },
    "click .proceed" : function (event) {
        event.preventDefault();
        if(Session.get("currentStep") == atgEventsTemplateHelpers.createSteps.confirm){
            saveEngagement();
        } else {
            goToStep(Session.get("currentStep") + 1);
        }
    },
    "keydown .proceed" : function () {
        event.preventDefault();
        if (event.keyCode == 13) {
            if (Session.get("currentStep") == atgEventsTemplateHelpers.createSteps.confirm) {
                saveEngagement();
            } else {
                goToStep(Session.get("currentStep") + 1);
            }
        }
    },
    "submit .ui.form" : function (event) {
        event.preventDefault();
    },
});

function goToStep(step) {

    if (Session.get("navigationCreateMessage")) {
        sAlert.info("Use the top bar to navigate backwards", {timeout: 'none'});
        Session.set("navigationCreateMessage", undefined);
    }

    $('.ui.form').form('validate form');
    if(!$('.ui.form').form('is valid')) { return };

    atgEventsAnimations.slideOutTop($("#slidable-container")).then( function (){
        Session.set("currentStep", step);
        // todo find a better workaround
        Session.set("slideInBottom", true);
    });
}

function goBackToStep(step) {
    atgEventsAnimations.slideOutBottom($("#slidable-container")).then( function (){
        Session.set("currentStep", step);
        Session.set("slideInTop", true);
    });
}

function saveEngagement() {
    var atgEvent = Session.get("newAtgEvent");

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
                atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
                        Session.set("slideInBottom", true);
                        if (Router.current().route.getName() != "atgEvents") {
                            Router.go("atgEvents");
                        }
                    }
                )
            }
        }
    );
}