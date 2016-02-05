Template.engagementsDashLegend.onRendered(function () {
	Session.set("legendShow", false);
})

Template.engagementsDashLegend.helpers({
	isLegendShowing : function () {
		return Session.get("legendShow");
	},
	getAllEventsTypes : function () {
		var hash = Session.get("engagementsTypesColorMap");
		result = [];
		for (var k in hash) {
			result.push({type: k.toUpperCase()})
		}
		return result
	}
}) 

Template.engagementsDashLegend.events({
	"click .engagements-legend" : function () {
		Session.set("legendShow", ! Session.get("legendShow"));
		
		if (hideLegendTimer) {  clearTimeout(hideLegendTimer); }
		hideLegendTimer = setTimeout(function() {
			Session.set("legendShow", false);
		}, 2000);
	}
});

var hideLegendTimer;