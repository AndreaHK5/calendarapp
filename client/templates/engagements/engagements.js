Template.engagements.onRendered(function () {
	Session.set("createEngagementMode", false);	
	mainHelpers.resetSessionForDash();
});

Template.engagements.helpers({
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
			setTimeout(function() {
				mainHelpers.adjustDayBoxHeight();
			}, 200);
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