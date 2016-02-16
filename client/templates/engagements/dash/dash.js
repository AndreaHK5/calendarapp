Template.engagementsDash.onRendered(function () {
	mainHelpers.resetSessionForDash();
	// register handler on resize boxes in order to fit all bubbles
  	// and to resize the calendar and tray 
  	$(window).resize(function(evt) {
    	mainHelpers.adjustDayBoxHeight();
    	mainHelpers.resizeTrayAndCalendar();
  	});
});

Template.engagementsDash.helpers({
	showDayEventsDetail : function () {
		return Session.get("dayForEventsDetail");
	},
})