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
			hideEventsContainer();
			sAlert.info("No events up for this day, may I suggest \"007, Try another day?\"");
			return;
		}
		sAlert.closeAll(); 
		// gate to check if another day had been selected
		// if (Session.get("dayForEventsDetail")) {
		// 	var date = this.fullDate;
		// 	hideEventsContainer().then( function () {
		// 		console.log(date);
		// 		Session.set("dayForEventsDetail", date);
		// 	});
		// } else {
			Session.set("dayForEventsDetail", this.fullDate);
		// }
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

function hideEventsContainer() {
	var deferred = Promise.defer();
	var calendar = $('#calendar-container');
	var eventsContainer = $('#dayevents-container');
	var totalHeight = getTotalHeight();
	
	TweenLite.to(eventsContainer, animationTime, { bottom: - 1 * eventsContainer.height()});

	TweenLite.set(calendar, {height:totalHeight});
	TweenLite.from(calendar, animationTime, {
		height:calendar.height(), 
		onComplete : function () {
			$('#calendar-container').css("overflow", "visible");
			resetSelectedDay();
			deferred.resolve();
		}
	});

	return deferred.promise;
}

function getTotalHeight() {
	return  $(window).height() - $('#site-navbar').height() - $('#weekday-navbar').height();
}

