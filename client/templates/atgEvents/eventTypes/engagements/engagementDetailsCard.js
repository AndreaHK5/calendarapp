Template.engagementDetailsCard.onRendered(function () {
	Meteor.subscribe("developers");
	Meteor.subscribe("publishers");
	this.autorun(function () {
		Session.get("popupAdded");
		Tracker.afterFlush(function () {
			$('.ui.image').popup();
		})
	});
});

Template.engagementDetailsCard.helpers({
	createdBy : function () {
		var user = Meteor.users.findOne({_id : this.createdBy});
		if (!user) { 
			return false; 
		}
		return user.username;
	},
	getPartnerCompanyName : function () {
        // this.-id means the event is already save in db
        var eventId = this._id;
        var relIds = Session.get("eventRelationshipIds");

        if (!eventId && !relIds){ return; }

        var partner;
        if (eventId) {
            partner = partners.findOne({events : eventId});
        } else {
            partner = partners.findOne({ _id : relIds.partnerId});
        }
        if (partner) {
            return partner.companyName;
        }

    },
	getGoals : function () {
        if (!("eventDetails" in this)) {return;}
		if (this.eventDetails.goals == undefined) { return; }
		return _.map(this.eventDetails.goals, function (goal) { return  { goal : goal }; });
	}
})