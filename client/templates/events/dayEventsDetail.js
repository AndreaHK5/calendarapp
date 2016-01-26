Template.dayEventsDetail.onRendered(function () {
	var totalHeight =  $(window).height() - $('#site-navbar').height() - $('#weekday-navbar').height();
	$('#calendar-container').css("height", totalHeight / 2);
	$('#calendar-container').css("overflow", "scroll");
	$('#calendar-container').css("margin-bottom", 0);
	$('#dayevents-container').height(totalHeight / 2);
})

Template.dayEventsDetail.helpers({
	eventsOfTheDay : function () {
		var unixDay = Session.get("dayForEventsDetail");
		return findEvents(unixDay,unixDay);
	}
})
