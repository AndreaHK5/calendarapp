Template.dayEventsDetail.onRendered(function () {
	showEventsContainer();
})

Template.dayEventsDetail.helpers({
	eventsOfTheDay : function () {
		var unixDay = Session.get("dayForEventsDetail");
		return findEvents(unixDay,unixDay);
	}
})

var animationTime = 0.4;

function showEventsContainer() {
	var calendar = $('#calendar-container');
	var eventsContainer = $('#dayevents-container');
	var totalHeight = getTotalHeight();

	// set height of calendar to window and add scroll
	// plus adjuxt margin bottom for semantic
	calendar.css("height", totalHeight);
	calendar.css("overflow", "scroll");
	calendar.css("margin-bottom", 0);
	eventsContainer.css("visibility", "visible");

	// animate up container
	// animate css for calendar
	// TODO open the container only to what is actually needed!
	TweenLite.set(calendar, {height:totalHeight /2});
	TweenLite.from(calendar, animationTime, {height:totalHeight});

	TweenLite.set(eventsContainer, {height:totalHeight /2});
	TweenLite.from(eventsContainer, animationTime, {height:0});
}

function getTotalHeight() {
	return  $(window).height() - $('#site-navbar').height() - $('#weekday-navbar').height();
}