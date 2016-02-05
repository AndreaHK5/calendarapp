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
	},
	typeFilter : function () {
		return Session.get("typeFilter");
	}
});

Template.engagementsDash.events({
	"click .day-box": function (event) {
		// in case the click is on the bubble, filter by that!
		// remember to skip in case the day has only one type anyway
		var type = undefined;

		var typesPerDay = Object.keys(Session.get("engagementsPerDay")[this.date] || {});
		if(_.contains(event.target.classList, "type-filer") && typesPerDay.length > 1) {
			type = Session.set("typeFilter", event.target.getAttribute("value-type"));
		} else {
			Session.set("typeFilter", undefined);
		}	

		// gate if date has no events
		if (Session.get("dayForEventsDetail") == this.date) { return; }	

		var query = mainHelpers.betweenTwoDatesEngagementsQuery(moment(this.date), moment(this.date));
		if (type) {
		// gate if this.date has no events
			query = mainHelpers.betweenDatesAndTypeEngagementsQuery(moment(this.date), moment(this.date), type) 
		}
		Session.set("engagementOnCalendar", undefined);
		if (Engagements.find(query).count() == 0) {
			mainHelpers.hideEventsContainer();
			Session.set("dayForEventsDetail", undefined);
			scrollCalendarToDiv();
			sAlert.info("No engagements up for this day, may I suggest \"007, Try another day?\"");
			return;
		}
		sAlert.closeAll(); 
			
		Session.set("dayForEventsDetail", this.date);
	},
	"click .close-day-container" : function (event) {
		mainHelpers.hideEventsContainer();
	},
	"click .clear-type-filter" : function (event) {
		Session.set("typeFilter", undefined);;
	}
})

// local helpers and variables
var animationTime = 0.4;

function resetSelectedDay() {
	Session.set("typeFilter", undefined);
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

