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
	},
	"click .close-day-container" : function (event) {
		hideEventsContainer();
	}
})

// local helpers and variables
var animationTime = 0.4;

function resetSelectedDay() {
	Session.set("dayForEventsDetail", undefined);
	// in case this was ever set
	Session.set("eventOnCalendar", undefined );
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

function resizeEventsContainer() {
	console.log("need resizing");
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

