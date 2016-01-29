if (Meteor.isClient) {
	getAllDistinctInEvents = function (query,next) {
		Meteor.call("getAllDistinctInEvents",query, next);
	}
	saveEvent = function (event, next) {
		Meteor.call("saveEvent", event, next);
	}
}

if (Meteor.isServer) {
	  Meteor.methods({
		getAllDistinctInEvents: function (query) {
			return Events.distinct(query);
		},
		saveEvent : function (event) {
			Events.insert(event);
			return event;
		}	  	
	  })

}