Template.engagementsDash.onRendered(function () {
	Session.set("createEngagementMode", false);	
	mainHelpers.resetSessionForDash();
});

Template.engagementsDash.helpers({
	showDayEventsDetail : function () {
		return Session.get("dayForEventsDetail");
	},
	isLoggedInUser : function () {
		return Meteor.user();
	},
	createModeOn : function () {
		var createMode = Session.get("createEngagementMode");
		if (createMode) {
			mainHelpers.resetSessionForCreate();
		} else {
			mainHelpers.resetSessionForDash();
		}
		return createMode;
	},
});


Template.engagementsDash.events({
	"click .create-engagement-button" : function () {
		var createMode = !Session.get("createEngagementMode")
		Session.set("createEngagementMode", createMode);
		if ( createMode ) {
			sAlert.info("Let's start with the Leaving Date");
		}
	}
}) 