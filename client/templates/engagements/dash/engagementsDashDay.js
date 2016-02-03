Template.engagementsDashDay.helpers({
	isSelectedDay : function () {
		return this.fullDate == Session.get("dayForEventsDetail");
	},
	isInTheEventOnCalendar : function () {
		// gate if no engagements are present
		if (!(Session.get("engagementOnCalendar"))) { return false;}

		var engagementOnCalendar = Session.get("engagementOnCalendar");
		return ( this.fullDate >= engagementOnCalendar.startDate && this.fullDate <= engagementOnCalendar.endDate);	
	},
	selectedEventType : function () {
		if (!(Session.get("engagementOnCalendar"))) { return ;}
		return Session.get("engagementOnCalendar").type;
	}
})