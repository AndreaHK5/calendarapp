Template.engagementBriefCard.onRendered( function () {
	this.autorun(function () {
		Session.get("popupAdded");
		Tracker.afterFlush(function () {
			$('.ui.avatar.image').popup();			
		})
	});
})

Template.engagementBriefCard.helpers({
	getGameTitleProduct : function () {
		return GameTitles.findOne(this.gameTitle.id).product;
	},
	getGameTitlecCodename : function () {
		return GameTitles.findOne(this.gameTitle.id).codename;
	},
	getEngineerData : function (id) {
		var eng = Engineers.findOne({_id : id});
		if (!eng) {return ;}
		Session.set("popupAdded",eng);
		return  { 
					name : eng.name,
				  	picture : eng.picture 
				};	
	},
	getDamData : function (id) {
		var dam = Dams.findOne({_id : id});
		if (!dam) { return ;}
		Session.set("popupAdded",dam);
		return  { 
					name : dam.name,
				  	picture : dam.picture 
				};	
	},
	isSelectedEvent : function (id) {
		if(!Session.get("engagementOnCalendar")) { return }
		return Session.get("engagementOnCalendar")._id == id;
	},
	isCreator : function () {
		return Meteor.user() && this.createdBy == Meteor.userId();
	},
});

Template.engagementBriefCard.events({
	"click .detail-page" : function () {
		Router.go('engagementDetailCard', { _id : this._id});
	},
	"click .open-details-modal" : function () {
		$('#' + this._id + '.details-modal').modal('show');
	}
})