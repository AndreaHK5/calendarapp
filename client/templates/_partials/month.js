Template.calendarMonth.helpers({
	getDayTemplate : function () {
		if ( Router.current().route.getName() == "tripsCreate") { return "calendarDay"; }
		if ( Router.current().route.getName() == "eventsIndex") { return "eventDay"; }
	}
});