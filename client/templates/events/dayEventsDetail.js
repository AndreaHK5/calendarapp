Template.dayEventsDetail.onRendered(function () {
	setTimeout(function() {
		showEventsContainer();
	}, 10);
	Session.set("eventOnCalendar", undefined );
})

Template.dayEventsDetail.helpers({
	eventsOfTheDay : function () {
		var unixDay = Session.get("dayForEventsDetail");
		if (eventContainerShowing) {
			adjustEventsContainer();
		} 
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
			timer = setTimeout(function() {
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

var eventContainerShowing = false;
var timer;

function setEventOnCalendar(event) {
	var eventOnCalendar = {
		startDate: event.startDate,
		endDate: event.endDate,
		type: event.type
	}
	Session.set("eventOnCalendar", eventOnCalendar );	
}

function resetEventOnCalendar() {
	clearTimeout(timer);
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
	var eventsHeight = Math.min(eventsContainer.height() + 19, totalHeight / 2);
	var calendarHeight = totalHeight - eventsHeight; 
	// set height of calendar to window and add scroll
	// plus adjust margin bottom for semantic
	calendar.css("height", totalHeight);
	calendar.css("overflow", "scroll");
	calendar.css("margin-bottom", 0);
	eventsContainer.css("visibility", "visible");

	// animate up container
	// animate css for calendar

	TweenLite.set(calendar, {height: calendarHeight});
	TweenLite.from(calendar, animationTime, {height: totalHeight});
	
	scrollCalendar();

	TweenLite.set(eventsContainer, {height: eventsHeight});
	TweenLite.from(eventsContainer, animationTime, { height: 0, 
		onComplete : function () { 
			eventContainerShowing = true;
		}
	});
}

function adjustEventsContainer() {
	setTimeout(function() {
		var eventsContainer = $('#dayevents-container');
		var calendar = $('#calendar-container');
		var totalHeight = getTotalHeight();
		var eventsHeight = Math.min($('#day-events-container').height() + 19, totalHeight / 2);
		var calendarHeight = totalHeight - eventsHeight; 

		TweenLite.to(calendar,animationTime, {height:calendarHeight});		
		TweenLite.to(eventsContainer,animationTime, {height:eventsHeight});
		scrollCalendar();

	}, 100);

}

function getTotalHeight() {
	return  $(window).height() - $('#site-navbar').height() - $('#weekday-navbar').height();
}

function scrollCalendar () {
	var selectedDay = $(".day-box-selected");
	var calendar = $('#calendar-container');

	var topY = calendar.scrollTop() + selectedDay.offset().top - 2* selectedDay.height();
	TweenLite.to(calendar, animationTime, {scrollTo:{y:topY}, ease:Power2.easeOut});
}