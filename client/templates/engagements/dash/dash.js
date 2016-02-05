Template.engagementsDash.onRendered(function () {
	resetSelectedDay();
	Meteor.subscribe("engagements");
});

Template.engagementsDash.helpers({
	showDayEventsDetail : function () {
		// ensure calendar is always visible
		return Session.get("dayForEventsDetail");
	},
	dayShowing : function () {
		return Session.get("dayForEventsDetail");
	}
});

Template.engagementsDash.events({
	"click .day-box": function (event) {
		// gate if clicking on same day
		if (Session.get("dayForEventsDetail") == this.date) { return; }
		// gate if date has no events
		Session.set("engagementOnCalendar", undefined);
		if (Engagements.find(mainHelpers.betweenTwoDatesEventsQuery(moment(this.date), moment(this.date))).count() == 0) {
			sAlert.info("No engagements up for this day, may I suggest \"007, Try another day?\"");
			if (Session.get("dayForEventsDetail")) { 
				mainHelpers.hideEventsContainer(); 
			} else {
				scrollCalendarToDiv();
			}
			return;
		}
		sAlert.closeAll(); 
		
		Session.set("dayForEventsDetail", this.date);
	},
	"click .close-day-container" : function (event) {
		mainHelpers.hideEventsContainer();
	}
})

// local helpers and variables
var animationTime = 0.4;

function resetSelectedDay() {
	Session.set("dayForEventsDetail", undefined);
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

