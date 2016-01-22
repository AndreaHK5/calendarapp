// TODO is there really not a better way to do this, other than manual injection??
Template.calendarMonth.helpers({
	whichDay : function () {
		if (FlowRouter.getRouteName() == "create") {
			return "calendarDay";
		}
		if (FlowRouter.getRouteName() == "events") {
			return "eventDay"
		}
	}
});