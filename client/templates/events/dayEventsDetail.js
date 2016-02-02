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
		return Events.find(betweenTwoDatesEventsQuery(unixDay,unixDay));
	},
	isSelectedEvent : function (id) {
		if(!Session.get("eventOnCalendar")) { return }
		return Session.get("eventOnCalendar")._id == id;
	}
})

Template.dayEventsDetail.events({
	"mouseenter .hover-event" : function () {
		if (!useHover) {return;} 
		var targetEvent = this;
		if (hoovering) {
			// another event has been hovered, so no need to wait to make the animation appear
			setEventOnCalendar(targetEvent);
		} else {
			// first event to be shown, on hover we wait to show
			showHoveredEventTimer = setTimeout(function() {
				hoovering = true;
				setEventOnCalendar(targetEvent);
			}, hooverDebounceTime);
		}

	},
	"mouseleave .hover-event" : function () {
		if (!useHover) {return;} 
		// this is required if the hover is to another card rather than to the calendar
		resetEventOnCalendar();
	},
	"mouseleave #day-events-container" : function () {
		hoovering = false;
		if (!useHover) {return;} 
		// this is required if the hover is to another card rather than to the calendar
		resetEventOnCalendar();
	},
	"click .select-event" : function () {
		useHover = false;
		hoovering = false;
		clearTimeout(showHoveredEventTimer);
		setEventOnCalendar(this);
	},
	"click .unselect-event" : function () {
		useHover = true;
		hoovering = false;
		clearTimeout(showHoveredEventTimer);
		resetEventOnCalendar();
		scrollCalendarToSelectedDay();
	},
	"click #calendar-container" : function () {
		resetEventOnCalendar();
	}
}) 

// local helpers and variables

var eventContainerShowing = false;
// if the user starts clicking on events turn off hoovering
var useHover = true;
// if we are already hoovering on something, do not debounce
var hoovering = false;
var animationTime = 0.4;
var hooverDebounceTime = 1200;
var removeClickedEventTime = 3200;
var showHoveredEventTimer;
var resetClickedEventTimer;



function setEventOnCalendar(event) {
	// resetEventOnCalendar();
	var eventOnCalendar = {
		startDate: event.startDate,
		endDate: event.endDate,
		type: event.type,
		_id: event._id
	}
	Session.set("eventOnCalendar", eventOnCalendar );
	setTimeout(function() {
		scrollCalendarToDiv($(".calendar-event-bar").first().parent().find(".day-box"));
		//TweenMax.allTo($(".calendar-event-bar"), 0.1, {opacity:1}, 0.02);
	}, 10);
	clearTimeout(resetClickedEventTimer);
	resetClickedEventTimer = setTimeout(function() {
		resetEventOnCalendar();
	}, removeClickedEventTime);
}

function resetEventOnCalendar() {
	useHover = true;
	clearTimeout(showHoveredEventTimer);
	Session.set("eventOnCalendar", undefined );
	scrollCalendarToSelectedDay();
}

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
	
	scrollCalendarToSelectedDay();

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
		var eventsHeight = Math.min($('#day-events-container').height() - 8 , totalHeight / 2);
		var calendarHeight = totalHeight - eventsHeight; 

		TweenLite.to(calendar,animationTime, {height:calendarHeight});		
		TweenLite.to(eventsContainer,animationTime, {height:eventsHeight});
		scrollCalendarToSelectedDay();

	}, 100);

}

function getTotalHeight() {
	return  $(window).height() - $('#site-navbar').height() - $('#weekday-navbar').height();
}

function scrollCalendarToSelectedDay () {
	scrollCalendarToDiv($(".day-box-selected"))
}


function scrollCalendarToDiv(div) {
	var calendar = $('#calendar-container');

	var topY = calendar.scrollTop() + div.offset().top - 2* div.height();
	TweenLite.to(calendar, animationTime, {scrollTo:{y:topY}, ease:Power2.easeOut});	
}
