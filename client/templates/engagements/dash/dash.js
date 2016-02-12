Template.engagementsDash.onRendered(function () {
	Session.set("createEngagementMode", false);	
	mainHelpers.resetSessionForDash();
	fadeInCalendar();
});

Template.engagementsDash.helpers({
	showDayEventsDetail : function () {
		return Session.get("dayForEventsDetail");
	},
	isLoggedInUser : function () {
		return Meteor.user();
	},
	createModeOn : function () {
		var createMode = Session.get("createEngagementMode");
		if (createMode) {
			mainHelpers.resetSessionForCreate();
		} else {
			mainHelpers.resetSessionForDash();
		}
		return createMode;
	},
	showCalendar : function () {
		if (Session.get("createEngagementMode")) {
			return datesMissing();
		} else {
			return true;
		}
	},
	detailsMissing : function () {
	  	var detailsMissing = !Session.get("formValid");
	    if (detailsMissing) {
	      return true;
	    } else {
	      scrollPlaceholderOut();     
	      return false;	
	    }
	},
	getEventDetails : function () {
	    var ev = Session.get("engagementDetails");
	    ev.startDate = Session.get("startDate");
	    ev.endDate = Session.get("endDate");
			return ev;
	},
});


Template.engagementsDash.events({
	"click .create-engagement-toggle" : function () {
		var createMode = Session.get("createEngagementMode")
		sAlert.closeAll();
		if ( createMode ) {
			sAlert.info("Let's look at the schedule");
			Session.set("createEngagementMode", !createMode);
		} else {
			mainHelpers.hideEventsContainer()
				.then(function () {
				Session.set("createEngagementMode", !createMode);
				sAlert.info("Let's start with the Leaving Date");
			});
		}
	},
	"click .reset-engagement" : function (event) {
	    scrollPlaceholderOut();
	    setTimeout(function() {
	      mainHelpers.resetSessionForCreate();
	    }, 600);
	    sAlert.warning("Let's start again!");
	},
	"click .reset-details" : function (event) {
	    scrollPlaceholderOut();
	    setTimeout(function() {
	      Session.set("formValid", false);     
	      Session.set("engagementDetails", undefined);     
	    }, 600);
	    sAlert.warning("Same Dates, different team");
	 },
})

function fadeInCalendar() {
  var calendar = $("#calendar-container");
  calendar.css("opacity", 0);
  TweenLite.to(calendar, 0.7, {ease : Sine.easeIn, opacity: 1});
} 

function datesMissing() {
  return !Session.get("startDate") || !Session.get("endDate");
}

function scrollPlaceholderOut () {
   var myDiv = $("#animationPlaceholder");
   var time = 800; //ms
   TweenLite.to(myDiv,time/1000, {height: $(window).height()});
}