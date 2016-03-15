Template.atgEvents.onRendered(function () {
	Session.set("createEngagementMode", false);	
});

Template.atgEvents.helpers({
	showCalendar : function () {
		return !Session.get("createEngagementMode") || atgEventsHelpers.datesMissing() ;
	},
    getCalendarTemplate : function (){
        if (Session.get("atgEventTypeId")) {
            return atgEventsHelpers.getTemplateForType(Session.get("atgEventTypeId"), "calendar");

        } else {
            return "atgEventsCalendar";
        }
    },
	showCreateModeToggle : function () {
		return Meteor.user() && atgEventsHelpers.datesMissing();
	},
	createModeOn : function () {
		var createMode = Session.get("createEngagementMode");
		if (!createMode) {
			atgEventsHelpers.resetSessionForDash();
		}
		return createMode;
	}
});


Template.atgEvents.events({
	"click .create-engagement-toggle" : function () {
		var createMode = Session.get("createEngagementMode");
		sAlert.closeAll();
		if ( createMode ) {
			Session.set("createEngagementMode", false);
		} else {
			atgEventsHelpers.hideEventsContainer().then(enterInCreateMode);
		}
	},
})

function enterInCreateMode() {
	Session.set("createEngagementMode", true);
    atgEventsHelpers.resetSessionForCreate();
    // TODO burn this with fire
	setTimeout( function() {
        atgEventsHelpers.showSelectTypeContainer();
    }, 300);
	sAlert.info("Tha type of events are we looking at?");
}