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
		// gate if clicking on same day
		if (Session.get("dayForEventsDetail") == this.fullDate) { return; }
		// gate if date has no events
		if (this.dayEvents.length == 0) {
			sAlert.info("No events up for this day, may I suggest \"007, Try another day?\"");
			if (Session.get("dayForEventsDetail")) { 
				hideEventsContainer(); 
			} 
			return;
		}
		sAlert.closeAll(); 

		Session.set("dayForEventsDetail", this.fullDate);
		// workaround in order to have all animations in one single controller
		// TODO - find out how to attach this to a call back
		setTimeout(function() {
			showEventsContainer();
		}, 10);
	},
	"click .close-day-container" : function (event) {
		hideEventsContainer();
	}
})

// local helpers and variables
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

function hideEventsContainer() {
	var calendar = $('#calendar-container');
	var eventsContainer = $('#dayevents-container');
	var totalHeight = getTotalHeight();
	
	TweenLite.to(eventsContainer, animationTime, { bottom: - 1 * eventsContainer.height()});

	TweenLite.set(calendar, {height:totalHeight});
	scrollCalendar();
	TweenLite.from(calendar, animationTime, {
		height:calendar.height(), 
		onComplete : function () {
			resetSelectedDay();
		}
	});
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

