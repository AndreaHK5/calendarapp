Template.tripsCreate.onRendered(function (){
    Session.set("startDate", undefined);
    Session.set("endDate", undefined);
    sAlert.info("Let's start with the Leaving Date");
})

Template.tripsCreate.helpers({
  datesMissing : function () {
    return datesMissing();
  },
  detailsMissing : function () {
  	return !Session.get("formValid");
  },
  	getEventDetails : function () {
		return Session.get("eventDetails");
	}
});

Template.tripsCreate.events({
  "click .reset-trip" : function (event) {
    var myDiv = $("#animationPlaceholder");
    var time = 800; //ms

    TweenLite.to(myDiv,time/1000, {height: $(window).height()});
    setTimeout(function() {
      Session.set("startDate", false);
      Session.set("endDate", false); 
      Session.set("formValid", false);     
      Session.set("eventDetails", undefined);     
    }, time - 200);
    sAlert.warning("Let's start again!");
  },
  "click .reset-details" : function (event) {
    var myDiv = $("#animationPlaceholder");
    var time = 800; //ms

    TweenLite.to(myDiv,time/1000, {height: $(window).height()});
    setTimeout(function() {
      Session.set("formValid", false);     
      Session.set("eventDetails", undefined);     
    }, time - 200);
    sAlert.warning("Same Dates, different team");
  },

});

function datesMissing() {
  return !Session.get("startDate") || !Session.get("endDate");
}