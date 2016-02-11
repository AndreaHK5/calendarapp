Template.engagementsDash.onRendered(function () {
	resetSelectedDay();
	Meteor.subscribe("engagements");
	Meteor.subscribe("gameTitles");
	// Semantic UI modal no removed from dom after callback runs in List Panel, removed manually here. 
	$('.basic.modal').remove();

	// register handler on resize boxes in order to fit all bubbles
	// and to resize the calendar and tray 

  	$(window).resize(function(evt) {
	    adjustdayBoxHeight();
		mainHelpers.resizeTrayAndCalendar();
  	});

  	// 
  	setTimeout(function() {
  		adjustdayBoxHeight()
  	}, 100);
});

Template.engagementsDash.helpers({
	showDayEventsDetail : function () {
		return Session.get("dayForEventsDetail");
	},
});

Template.engagementsDash.events({
	"click .day-box": function (event) {
		// TYPE FILTERING
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
		scrollCalendarToDiv();
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
	var div = $('.day-box-unselected:hover');
	if (div.length == 0) {
		div = $('.day-box-selected');
	} 
	mainHelpers.scrollCalendarToDay(div);	
}

function adjustdayBoxHeight() {
	var standardDayBoxHeight = 98;
	var requiredHeight = lodash.reduce($('.day-box'), 
		function (heightRequired, e) { 
			var thisBoxHeight = $(e).find('.engagement-day-top').outerHeight(true) + $(e).find('.engagement-day-bottom').outerHeight(true);
			return Math.max(heightRequired, thisBoxHeight);
		},
		standardDayBoxHeight
	);

	TweenMax.to($('.day-box'), 0.8, { ease: Power4.easeOut, height : requiredHeight });
}