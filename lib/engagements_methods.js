if (Meteor.isClient) {
	saveEngagement = function (engagement, next) {
		Meteor.call("saveEngagement", engagement, next);
	}
	removeEngagement = function (id, next) {
		Meteor.call("removeEngagement", id, next);
	}
}



if (Meteor.isServer) {
	  Meteor.methods({
		saveEngagement : function (engagement) {
			if (! Meteor.userId()) {
      			throw new Meteor.Error("cannot save engagment for not logged in user");
    		}
			Engagements.insert(engagement);
			return engagement;
		},
		removeEngagement : function (id) {
			//  gates
			if (! Meteor.userId()) {
      			throw new Meteor.Error("cannot remove engagment for not logged in user");
    		}
			var doc = Engagements.findOne(id);
			if (Meteor.userId() != doc.createdBy) {
      			throw new Meteor.Error("cannot remove other user's engagment");
    		}

			Engagements.remove(id);
			return "engagement " + id + ", " + doc.title + " removed";
		}	  	
	  })

}