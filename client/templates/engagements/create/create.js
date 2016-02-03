Template.engagementsCreate.onRendered(function (){
    Session.set("startDate", undefined);
    Session.set("endDate", undefined);
    Session.set("engagementDetails", undefined);
    Session.set("formValid", undefined);
    sAlert.info("Let's start with the Leaving Date");
})

Template.engagementsCreate.helpers({
  datesMissing : function () {
    return datesMissing();
  },
  detailsMissing : function () {
  	return !Session.get("formValid");
  },
  getEventDetails : function () {
    var ev = Session.get("engagementDetails");
    ev.startDate = Session.get("startDate");
    ev.endDate = Session.get("endDate");
		return ev;
	}
});

Template.engagementsCreate.events({
  "click .reset-engagement" : function (event) {
    var myDiv = $("#animationPlaceholder");
    var time = 800; //ms

    TweenLite.to(myDiv,time/1000, {height: $(window).height()});
    setTimeout(function() {
      Session.set("startDate", false);
      Session.set("endDate", false); 
      Session.set("formValid", false);     
      Session.set("engagementDetails", undefined);     
    }, time - 200);
    sAlert.warning("Let's start again!");
  },
  "click .reset-details" : function (event) {
    var myDiv = $("#animationPlaceholder");
    var time = 800; //ms

    TweenLite.to(myDiv,time/1000, {height: $(window).height()});
    setTimeout(function() {
      Session.set("formValid", false);     
      Session.set("engagementDetails", undefined);     
    }, time - 200);
    sAlert.warning("Same Dates, different team");
  },

});

function datesMissing() {
  return !Session.get("startDate") || !Session.get("endDate");
}