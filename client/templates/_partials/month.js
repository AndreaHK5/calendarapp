Template.calendarMonth.helpers({
	getDayTemplate : function () {
		console.log(Router.current().route.getName());
		if ( Router.current().route.getName() == "tripsCreate") { return "calendarDay"; }
		if ( Router.current().route.getName() == "eventsIndex") { return "eventDay"; }
	}
});