Template.selectedDates.onRendered( function () {
	var myDiv = $("#animationPlaceholder");
  	myDiv.height($(window).height() - $(".confirm-jumbo").height());
  	TweenLite.to(myDiv,0.8, {height: 0});
}); 

Template.selectedDates.helpers({
	getStartDate : function () {
    	return Session.get("startDate");
  	},
  	getEndDate : function () {
    	return Session.get("endDate");
	}
})