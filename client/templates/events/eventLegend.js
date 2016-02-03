Template.eventLegend.onRendered(function () {
	Session.set("legendShow", false);
})

Template.eventLegend.helpers({
	isLegendShowing : function () {
		return Session.get("legendShow");
	},
	getAllEventsTypes : function () {
		var hash = Session.get("eventsMap");
		result = [];
		for (var k in hash) {
			result.push({eventType: k.toUpperCase()})
		}
		return result
	}
}) 

Template.eventLegend.events({
	"click .event-legend" : function () {
		Session.set("legendShow", ! Session.get("legendShow"));
	}
});