if (Meteor.isClient) {
	getAllEngineers = function (next) {
		Meteor.call("getAllEngineers", next);
	}
}

if (Meteor.isServer) {
	  Meteor.methods({
		getAllEngineers: function () {
			return Events.distinct("engineersGoing");
		}	  	
	  })

}