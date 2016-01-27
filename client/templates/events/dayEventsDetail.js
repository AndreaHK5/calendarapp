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
	},
	isSelectedEvent : function (id) {
		if(!Session.get("eventOnCalendar")) { return }
		return Session.get("eventOnCalendar")._id == id;
	}
})

Template.dayEventsDetail.events({
	"mouseenter .select-event" : function () {
		if (!useHover) {return;} 
		var targetEvent = this;
		if (Session.get("eventOnCalendar")) {
			// another event has been hovered, so no need to wait to make the animation appear
			setEventOnCalendar(this);
		} else {
			// first event to be shown, on hover we wait to show
			showEventTimer = setTimeout(function() {
				setEventOnCalendar(targetEvent);
			}, 500);
		}

	},
	"mouseleave .select-event" : function () {
		if (!useHover) {return;} 
		resetEventOnCalendar();
	},
	"click .select-event" : function () {
		useHover = false;
		clearTimeout(showEventTimer);
		setEventOnCalendar(this);
	},
	"click .unselect-event" : function () {
		useHover = true;
		clearTimeout(showEventTimer);
		resetEventOnCalendar();
		scrollCalendarToSelectedDay();
	},
	"click #calendar-container" : function () {
		resetEventOnCalendar();
	},
}) 

// local helpers and variables

var eventContainerShowing = false;
var showEventTimer;
var useHover = true;

function setEventOnCalendar(event) {
	var eventOnCalendar = {
		startDate: event.startDate,
		endDate: event.endDate,
		type: event.type,
		_id: event._id
	}
	Session.set("eventOnCalendar", eventOnCalendar );
	setTimeout(function() {
		scrollCalendarToDiv($(".calendar-event-bar").first().parent().find(".day-box"));
	}, 100);
}

function resetEventOnCalendar() {
	useHover = true;
	clearTimeout(showEventTimer);
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
		var eventsHeight = Math.min($('#day-events-container').height() + 19, totalHeight / 2);
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
