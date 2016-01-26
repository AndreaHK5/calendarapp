Template.dayEventsDetail.onRendered(function () {
})

Template.dayEventsDetail.helpers({
	eventsOfTheDay : function () {
		var unixDay = Session.get("dayForEventsDetail");
		return findEvents(unixDay,unixDay);
	}
})