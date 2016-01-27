Template.dayEventsDetail.onRendered(function () {
	setTimeout(function() {
		showEventsContainer(false);
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

var eventContainerShowing = false;

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

function showEventsContainer(useCurrentHeights) {
	var calendar = $('#calendar-container');
	var eventsContainer = $('#dayevents-container');
	var totalHeight = getTotalHeight();
	var eventsHeight = Math.min(eventsContainer.scrollHeight + 19, totalHeight / 2);
	var calendarHeight = totalHeight - eventsHeight; 
	// set height of calendar to window and add scroll
	// plus adjust margin bottom for semantic
	calendar.css("height", totalHeight);
	calendar.css("overflow", "scroll");
	calendar.css("margin-bottom", 0);
	eventsContainer.css("visibility", "visible");

	// animate up container
	// animate css for calendar
	var calendarStart = useCurrentHeights ? calendar.height() : totalHeight;

	TweenLite.set(calendar, {height: calendarHeight});
	TweenLite.from(calendar, animationTime, {height: calendarStart});
	
	scrollCalendar();

	var eventsStart = useCurrentHeights ? eventsContainer.height() : 0;	
	TweenLite.set(eventsContainer, {height: eventsHeight});
	TweenLite.from(eventsContainer, animationTime, { height: eventsStart, 
		onComplete : function () { 
			eventContainerShowing = true;
		}
	});
}

function adjustEventsContainer() {
	showEventsContainer(true);
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