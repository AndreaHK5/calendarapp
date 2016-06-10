 Template.atgEventsMonth.helpers({
	getDayTemplate : function () {
        return Router.current().route.getName() == "atgEventCreate" ?
            "atgEventCreateDay" :
            "atgEventDashDay";
	},
	getDays : function () {
		return getDaysInMonth(this.date);
	},
	getMonth : function (isoTime) {
  		return moment(isoTime).format('MMMM');
	},
	getYear : function (isoTime) {
 		return moment(isoTime).year();
	}
});

function getDaysInMonth(isoTime, eventsPerDay) {
    var result = [];
    var startOfMonth = moment(isoTime);
    for (var i = 0; i < startOfMonth.day(); i++) {
    	result.push({});
    };

    var day = startOfMonth;
    var endOfMonth = moment(isoTime).endOf('month'); 
    while (day.isBefore(endOfMonth)) {
    	result.push({date : day.toISOString()});
    	day = day.add(1,'day');
    }
    return result;
}