if (Meteor.isClient) {
	saveEngagement = function (engagement, next) {
		Meteor.call("saveEngagement", engagement, next);
	}
}

if (Meteor.isServer) {
	  Meteor.methods({
		saveEngagement : function (engagement) {
			Engagements.insert(engagement);
			return engagement;
		}	  	
	  })

}