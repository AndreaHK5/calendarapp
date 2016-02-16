Template.engagementsCreate.helpers({
	showCalendar : function () {
		return datesMissing();
	},
	detailsMissing : function () {
	  	var detailsMissing = !Session.get("formValid");
	    if (detailsMissing) {
	      return true;
	    } else {
	      mainHelpers.scrollPlaceholderOut();     
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

Template.engagementsCreate.events({
	"click .reset-engagement" : function (event) {
		event.preventDefault();
	    mainHelpers.scrollPlaceholderOut().then( function () {
	    	mainHelpers.resetSessionForCreate();
	    });
	    sAlert.warning("Let's start again!");
	},
	"click .reset-details" : function (event) {
	    mainHelpers.scrollPlaceholderOut().then(function () {
	      Session.set("formValid", false);     	    	
	    });
	    sAlert.warning("Same Dates, different team");
	},
})

function datesMissing() {
  return !Session.get("startDate") || !Session.get("endDate");
}