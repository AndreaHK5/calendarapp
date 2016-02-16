Template.engagementsDash.onRendered(function () {
	Session.set("createEngagementMode", false);	
	mainHelpers.resetSessionForDash();
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
			setTimeout(function() {
				mainHelpers.adjustDayBoxHeight();
			}, 200);
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
			if (datesMissing()) {
				sAlert.info("Let's look at the schedule");
				Session.set("createEngagementMode", false);
			} else {
				scrollPlaceholderOut().then(function () {
					sAlert.info("Let's look at the schedule");
					Session.set("createEngagementMode", false);
				})
			}

		} else {
			mainHelpers.hideEventsContainer().then(enterInCreateMode);
		}
	},
	"click .reset-engagement" : function (event) {
		event.preventDefault();
	    scrollPlaceholderOut().then( function () {
	    	mainHelpers.resetSessionForCreate();
	    });
	    sAlert.warning("Let's start again!");
	},
	"click .reset-details" : function (event) {
	    scrollPlaceholderOut().then(function () {
	      Session.set("formValid", false);     	    	
	    });
	    sAlert.warning("Same Dates, different team");
	 },
})

function enterInCreateMode() {
	sAlert.info("CREATE ENGAGEMENT MODE",{ 
		position: "top", 
		timeout: 10000,
	});
	Session.set("createEngagementMode", true);
	sAlert.info("Let's start with the Leaving Date");
}

function datesMissing() {
  return !Session.get("startDate") || !Session.get("endDate");
}

function scrollPlaceholderOut () {
	var deferred = Promise.defer();
    var myDiv = $("#animationPlaceholder");
    var time = 800; //ms
    TweenLite.to(myDiv,time/1000, {
   		height: $(window).height(),
   		onComplete : function () {
   			deferred.resolve();
   		}
   	});
   return deferred.promise;
}