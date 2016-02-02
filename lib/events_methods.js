if (Meteor.isClient) {
	saveEvent = function (event, next) {
		Meteor.call("saveEvent", event, next);
	}
}

if (Meteor.isServer) {
	  Meteor.methods({
		saveEvent : function (event) {
			Events.insert(event);
			return event;
		}	  	
	  })

}