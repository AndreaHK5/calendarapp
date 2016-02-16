Template.engagementsDash.onRendered(function () {
	mainHelpers.resetSessionForDash();
});

Template.engagementsDash.helpers({
	showDayEventsDetail : function () {
		return Session.get("dayForEventsDetail");
	},
})