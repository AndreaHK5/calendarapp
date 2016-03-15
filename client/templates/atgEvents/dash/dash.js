Template.engagementsDash.onRendered(function () {
	atgEventsHelpers.resetSessionForDash();
	// register handler on resize boxes in order to fit all bubbles
  	// and to resize the calendar and tray 
  	$(window).resize(function(evt) {
    	atgEventsHelpers.adjustDayBoxHeight();
    	atgEventsHelpers.resizeTrayAndCalendar();
  	});

  	this.autorun(function () {
		var queryStartDate = atgEventsHelpers.getTodayDate();
		var queryEndDate = atgEventsHelpers.GetLastMonthShowing().endOf('month');
		var atgEventsPerDay = {};
		atgEvents.find(atgEventsHelpers.betweenTwoDatesEngagementsQuery(queryStartDate, queryEndDate))
		.forEach(function (e) {		        
	        // startign form the beginning of the engagement or of the query (and same for ending)
	        var startLoop = moment.max(moment(e.startDate).startOf("Day"), moment(queryStartDate));
	        var endLoop = moment.min(moment(e.endDate), moment(queryEndDate));
	        var type = atgEventTypes.findOne({ _id : e.atgEventTypeId })["type"];
			// traverse all days and add the event to the single day map
	        for(var m = startLoop; !m.isAfter(endLoop);  m.add('days',1)) {
	          var isoDay = m.toISOString();
	          // initailize objects if not present
	          if (! (isoDay in atgEventsPerDay)) { atgEventsPerDay[isoDay] = {}; }
	          if (! (type in atgEventsPerDay[isoDay])) { atgEventsPerDay[isoDay][type] = 0 }
	          atgEventsPerDay[isoDay][type] ++;
	        }
	    });
	    Session.set("engagementsPerDay", atgEventsPerDay);
  	})
});

Template.engagementsDash.helpers({
	showDayEventsDetail : function () {
		return Session.get("dayForEventsDetail");
	}
})