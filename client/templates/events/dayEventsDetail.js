Template.dayEventsDetail.onRendered(function () {
	showEventsContainer();
	Session.set("eventOnCalendar", undefined );
})

Template.dayEventsDetail.helpers({
	eventsOfTheDay : function () {
		var unixDay = Session.get("dayForEventsDetail");
		return findEvents(unixDay,unixDay);
	}
})

Template.dayEventsDetail.events({
	"mouseenter .select-event" : function () {
		var targetEvent = this;
		if (Session.get("eventOnCalendar")) {
			// another event has been hovered, so no need to wait to make the animation appear
			setEventOnCalendar(this);
		} else {
			// first event to be shown, on hover we wait to show
			setTimeout(function() {
				setEventOnCalendar(targetEvent);
			}, 500);
		}

	},
	"mouseleave .select-event" : function () {
		resetEventOnCalendar();
	},
	"click .select-event" : function () {
		setEventOnCalendar(this);
	},
	"click #calendar-container" : function () {
		resetEventOnCalendar();
	},
}) 

// local helpers and variables

function setEventOnCalendar(event) {
	var eventOnCalendar = {
		startDate: event.startDate,
		endDate: event.endDate,
		type: event.type
	}
	Session.set("eventOnCalendar", eventOnCalendar );	
}

function resetEventOnCalendar() {
	Session.set("eventOnCalendar", undefined );
}

var animationTime = 0.4;

function resetSelectedDay() {
	Session.set("dayForEventsDetail", undefined);
}

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
	scrollCalendar();
	TweenLite.set(eventsContainer, {height:totalHeight /2});
	TweenLite.from(eventsContainer, animationTime, {height:0});
}

function getTotalHeight() {
	return  $(window).height() - $('#site-navbar').height() - $('#weekday-navbar').height();
}

function scrollCalendar () {
	var selectedDay = $(".day-box-selected");
	var calendar = $('#calendar-container');

	var topY = selectedDay.offset().top - 2 * selectedDay.height() / 2 - $("#site-navbar").height();
	TweenLite.to(calendar, animationTime, {scrollTo:{y:topY}, ease:Power2.easeOut});
}