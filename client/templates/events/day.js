Template.eventDay.helpers({
	isSelectedDay : function () {
		return this.fullDate == Session.get("dayForEventsDetail");
	}
})