Template.engagementBriefCard.onRendered( function () {
	setTimeout(function() {
		$('.ui.avatar.image').popup();
	}, 200);
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
		return  { 
					name : eng.name,
				  	picture : eng.picture 
				};	
	},
	getDamData : function (id) {
		var dam = Dams.findOne({_id : id});
		if (!dam) { return ;}
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