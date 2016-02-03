Template.engagementsDashDay.helpers({
	isSelectedDay : function () {
		return this.fullDate == Session.get("dayForEventsDetail");
	},
	isInTheEventOnCalendar : function () {
		// gate if no event is present
		if (!(Session.get("eventOnCalendar"))) { return false;}

		var eventOnCalendar = Session.get("eventOnCalendar");
		return ( this.fullDate >= eventOnCalendar.startDate && this.fullDate <= eventOnCalendar.endDate);	
	},
	selectedEventType : function () {
		if (!(Session.get("eventOnCalendar"))) { return ;}
		return Session.get("eventOnCalendar").type;
	}
})