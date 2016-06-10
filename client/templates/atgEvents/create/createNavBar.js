Template.atgEventCreateNavBar.helpers({
    showTeamSelectionStep : function (){
        // the entry is false if no template is to show
        if (!Session.get("newAtgEvent")) {return;}
        return atgEventsTemplateHelpers.getTemplateForType(Session.get("newAtgEvent").atgEventTypeId, "teamSelection");
    },
    getSelectedType : function () {
        if (!Session.get("newAtgEvent")) {
            return false;
        }
        return atgEventTypes.findOne({ _id : Session.get("newAtgEvent").atgEventTypeId}).type;
    },
    pastDateStep : function () {
        return Session.get("currentStep") > atgEventsTemplateHelpers.createSteps.selectDates;
    },
    onTeamStep : function () {
        return Session.get("currentStep") == atgEventsTemplateHelpers.createSteps.selectTeam;
    },
    onDatesStep : function () {
        return Session.get("currentStep") == atgEventsTemplateHelpers.createSteps.selectDates;
    },
    onDetailsStep : function () {
        return Session.get("currentStep") == atgEventsTemplateHelpers.createSteps.details;
    },
    onConfirmStep : function () {
        return Session.get("currentStep") == atgEventsTemplateHelpers.createSteps.confirm;
    }
});

Template.atgEventCreateNavBar.events({
    "click .close-create-mode": function () {
        // TODO make these parallel promises in jquery or somethign that IE can take
        TweenMax.to($("#crete-nav-bar"), 0.6, {top: -($("#create-nav-bar").outerHeight()) });
            atgEventsAnimations.slideOutBottom( $("#slidable-container")).then(function () {
                sAlert.closeAll();
                Router.go("atgEvents");
                Session.set("slideInTop", true);
                Session.set("newAtgEvent", undefined);
            })
    },
});