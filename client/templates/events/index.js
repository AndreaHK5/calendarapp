Template.eventsIndex.onRendered(function () {
	resetSelectedDay();
});

Template.eventsIndex.helpers({
	showDayEventsDetail : function () {
		// ensure calendar is always visible
		if (!(Session.get("dayForEventsDetail"))) {
			$('#calendar-container').css("overflow", "visible");
		}
		return Session.get("dayForEventsDetail");
	}
});

Template.eventsIndex.events({
	"click .day-box": function (event) {
		if (this.dayEvents.length == 0) {
			sAlert.info("No events up for this day, may I suggest \"007, Try another day?\"");
			resetSelectedDay();
			return;
		}
		sAlert.closeAll();
		Session.set("dayForEventsDetail", this.fullDate);
	},
	"click .close-day-container" : function (event) {
		$('#calendar-container').css("overflow", "visible");
		resetSelectedDay();
	}
})


resetSelectedDay = function () {
	Session.set("dayForEventsDetail", undefined);
}
