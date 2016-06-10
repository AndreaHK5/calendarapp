Template.atgEventDashDay.onRendered(function () {
	Meteor.subscribe("allProducts");
})


Template.atgEventDashDay.helpers({
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
		return Session.get("engagementOnCalendar").atgEventTypeId;
	},
	dayNumber : function () {
		return moment(this.date).date();
	},	
	dayEvents : function () {
		var engagementsPerDay = Session.get("engagementsPerDay");
		if (!engagementsPerDay) { return ;}
		var result = _.map(engagementsPerDay[this.date], function (v, k) { return { type: k, count : v}} );
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

Template.atgEventDashDay.events({
	"click .day-box": function (event) {

        // if the same day is clicked (unless it is for futher filtering) hide the botton tray
		if (this.date == Session.get("dayForEventsDetail") &&
			event.target.getAttribute("value-type") == Session.get("typeFilter")) {
            atgEventsAnimations.hideEventsContainer();
		}
		// TYPE FILTERING
		// in case the click is on the bubble, filter by that (and skip in case only one type is present)
		var type = undefined;
		var typesPerDay = Object.keys(Session.get("engagementsPerDay")[this.date] || {});
		if(_.contains(event.target.classList, "type-filer") && typesPerDay.length > 1) {
			type = Session.set("typeFilter", event.target.getAttribute("value-type"));
		} else {
			Session.set("typeFilter", undefined);
		}

		// gate if date has no events
		if (Session.get("dayForEventsDetail") == this.date) { return; }

		var query = atgEventsTemplateHelpers.betweenTwoDatesEngagementsQuery(moment(this.date), moment(this.date).endOf("Day"));
		if (type) {
		// gate if this.date has no events
			query = atgEventsTemplateHelpers.betweenDatesAndTypeEngagementsQuery(moment(this.date), moment(this.date).endOf("Day"), type)
		}
		Session.set("engagementOnCalendar", undefined);
		if (atgEvents.find(query).count() == 0) {
			atgEventsAnimations.hideEventsContainer();
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
	var div = $('.day-box:hover');
	if (div.length == 0) {
		div = $('.day-box-selected');
	}
	atgEventsAnimations.scrollCalendarToDay(div);
}
