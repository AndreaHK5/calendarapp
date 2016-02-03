Template.engagementsDashDay.helpers({
	isSelectedDay : function () {
		return this.date == Session.get("dayForEventsDetail");
	},
	isInTheEventOnCalendar : function () {
		// gate if no engagements are present
		if (!(Session.get("engagementOnCalendar"))) { return false;}

		var engagementOnCalendar = Session.get("engagementOnCalendar");
		return ( this.date >= engagementOnCalendar.startDate && this.date <= engagementOnCalendar.endDate);	
	},
	selectedEventType : function () {
		if (!(Session.get("engagementOnCalendar"))) { return ;}
		return Session.get("engagementOnCalendar").type;
	},
	dayNumber : function (isoDate) {
		return moment(isoDate).date();
	}
})