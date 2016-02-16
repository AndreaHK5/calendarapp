Template.engagementsDashDay.onRendered(function () {
	Meteor.subscribe("engagements");
	Meteor.subscribe("gameTitles");
})


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
		Session.set("newDayRendered",result.length)
		return result;
	},
	isTypeInFilter : function (type, date) {
		// halo if no day is selected
		if ( date != Session.get("dayForEventsDetail") ) { return false; }

		var currentType = Session.get("typeFilter");
		// all bubbles to get a halo in case there is no selected type
		if (!currentType) { return true; }
		return type == currentType;
	},
})

Template.engagementsDashDay.events({
	"click .day-box": function (event) {
		// TYPE FILTERING
		// in case the click is on the bubble, filter by that!
		// remember to skip in case the day has only one type anyway
		var type = undefined;
		var typesPerDay = Object.keys(Session.get("engagementsPerDay")[this.date] || {});
		if(_.contains(event.target.classList, "type-filer") && typesPerDay.length > 1) {
			type = Session.set("typeFilter", event.target.getAttribute("value-type"));
		} else {
			Session.set("typeFilter", undefined);
		}	

		// gate if date has no events
		if (Session.get("dayForEventsDetail") == this.date) { return; }	

		var query = mainHelpers.betweenTwoDatesEngagementsQuery(moment(this.date), moment(this.date));
		if (type) {
		// gate if this.date has no events
			query = mainHelpers.betweenDatesAndTypeEngagementsQuery(moment(this.date), moment(this.date), type) 
		}
		Session.set("engagementOnCalendar", undefined);
		if (Engagements.find(query).count() == 0) {
			mainHelpers.hideEventsContainer();
			scrollCalendarToDiv();
			sAlert.info("No engagements up for this day, may I suggest \"007, Try another day?\"");
			return;
		}
		sAlert.closeAll(); 
			
		Session.set("dayForEventsDetail", this.date);
		scrollCalendarToDiv();
	},
})

function scrollCalendarToDiv() {
	var div = $('.day-box-unselected:hover');
	if (div.length == 0) {
		div = $('.day-box-selected');
	} 
	mainHelpers.scrollCalendarToDay(div);	
}
