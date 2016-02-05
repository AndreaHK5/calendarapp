Template.engagementsDashDay.helpers({
	isSelectedDay : function () {
		return this.date == Session.get("dayForEventsDetail");
	},
	isInTheEventOnCalendar : function () {
		// gate if no engagements are present
		if (!(Session.get("engagementOnCalendar"))) { return false;}

		var engagementOnCalendar = Session.get("engagementOnCalendar");

		return ( !moment(this.date).isBefore(moment(engagementOnCalendar.startDate)) && !moment(this.date).isAfter(moment(engagementOnCalendar.endDate)) );	
	},
	selectedEventType : function () {
		if (!(Session.get("engagementOnCalendar"))) { return ;}
		return Session.get("engagementOnCalendar").type;
	},
	dayNumber : function () {
		return moment(this.date).date();
	},	
	dayEvents : function () {
		var engagementsPerDay = Session.get("engagementsPerDay");
		var result = _.map(engagementsPerDay[this.date], function (v, k) { return { type: k, count : v}} );
		return result;
	}
})