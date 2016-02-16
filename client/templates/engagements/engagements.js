Template.engagements.onRendered(function () {
	Session.set("createEngagementMode", false);	
});

Template.engagements.helpers({
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


Template.engagements.events({
	"click .create-engagement-toggle" : function () {
		var createMode = Session.get("createEngagementMode")
		sAlert.closeAll();
		if ( createMode ) {
			if (datesMissing()) {
				sAlert.info("Let's look at the schedule");
				Session.set("createEngagementMode", false);
			} else {
				mainHelpers.scrollPlaceholderOut().then(function () {
					sAlert.info("Let's look at the schedule");
					Session.set("createEngagementMode", false);
				})
			}

		} else {
			mainHelpers.hideEventsContainer().then(enterInCreateMode);
		}
	},
})

function enterInCreateMode() {
	sAlert.info("CREATE ENGAGEMENT MODE",{ 
		position: "top", 
		timeout: 10000,
	});
	Session.set("createEngagementMode", true);
	sAlert.info("Let's start with the Leaving Date");
}

function datesMissing() {
  return !Session.get("startDate") || !Session.get("endDate");
}