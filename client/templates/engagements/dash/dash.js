Template.engagementsDash.onRendered(function () {
	resetSelectedDay();
});

Template.engagementsDash.helpers({
	showDayEventsDetail : function () {
		// ensure calendar is always visible
		if (!(Session.get("dayForEventsDetail"))) {
		}
		return Session.get("dayForEventsDetail");
	}
});

Template.engagementsDash.events({
	"click .day-box": function (event) {
		// gate if clicking on same day
		if (Session.get("dayForEventsDetail") == this.fullDate) { return; }
		// gate if date has no events
		Session.set("eventOnCalendar", undefined);
		if (this.dayEvents.length == 0) {
			sAlert.info("No events up for this day, may I suggest \"007, Try another day?\"");
			if (Session.get("dayForEventsDetail")) { 
				hideEventsContainer(); 
			} else {
				scrollCalendarToDiv();
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

function resetSelectedDay () {
	Session.set("dayForEventsDetail", undefined);
}


function hideEventsContainer() {
	var calendar = $('#calendar-container');
	var eventsContainer = $('#dayevents-container');
	var totalHeight = getTotalHeight();
	
	TweenLite.to(eventsContainer, animationTime, { bottom: - 1 * eventsContainer.height()});

	TweenLite.set(calendar, {height:totalHeight});
	scrollCalendarToDiv();
	Session.set("eventOnCalendar", undefined );
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

function scrollCalendarToDiv() {
	var calendar = $('#calendar-container');
	var div = $('.day-box-unselected:hover');
	if (div.length == 0) {
		div = $('.day-box-selected');
	} 

	var topY = calendar.scrollTop() + div.offset().top - 2 * div.height();
	TweenLite.to(calendar, animationTime, {scrollTo:{y:topY}, ease:Power2.easeOut});	
}

