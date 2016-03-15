Template.eventsCreateNavBar.helpers({
    getSelectedType : function () {
        if (!Session.get("atgEventTypeId")) {
            return false;
        }
        return atgEventTypes.findOne({ _id : Session.get("atgEventTypeId")}).type;
    },
    getStartDate : function () {
        if (!Session.get("startDate")) {
            return false;
        }
        return Session.get("startDate");
    },
    getEndDate : function () {
        if (!Session.get("endDate")) {
            return false;
        }
        return Session.get("endDate");
    },
    formValid : function () {
        return Session.get("formValid");
    },
    twoDatesEvent : function () {
        return atgEventsHelpers.getTemplateForType(Session.get("atgEventTypeId"), "calendar") == "atgEventsCalendar";
    }
})



Template.eventsCreateNavBar.events({
    "click .close-create-mode": function () {
        // TODO make these parallel promises in jquery or somethign that IE can take
        atgEventsHelpers.hideSelectTypeContainer().then( function() {
            atgEventsHelpers.scrollOutBottom(
                $("#event-details-container").add($("#confirm-container"))
            ).then(function () {
                sAlert.closeAll();
                Session.set("createEngagementMode", false);
                atgEventsHelpers.positionTrayAndCalendar();
            })
        })
    },
    "click .reset-selected-type": function () {
        atgEventsHelpers.resetSessionForCreate();
        // TODO remove this and use a promise for when the DOM Tree is updated
        setTimeout(function () {
            atgEventsHelpers.showSelectTypeContainer();

        }, 10);
    },
    "click .reset-start-type" : function () {
        Session.set("startDate", false);
        sAlert.warning("Let's leave on another day then.")
    }
})