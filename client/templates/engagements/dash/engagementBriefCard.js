Template.engagementBriefCard.helpers({
	// createdBy : function () {
	// 	var user = Meteor.users.findOne({_id : this.createdBy});
	// 	if (!user) { 
	// 		return false; 
	// 	}
	// 	return user.username;
	// },
	getGameTitleProduct : function () {
		return GameTitles.findOne(this.gameTitle.id).product;
	},
	getGameTitlecCodename : function () {
		return GameTitles.findOne(this.gameTitle.id).codename;
	},
	getEngineerPicture : function (id) {
		var eng = Engineers.findOne({_id : id});
		if (!eng) {return ;}
		return eng.picture;
	},
	getDamPicture : function (id) {
		var dam = Dams.findOne({_id : id});
		if (!dam) { return ;}
		return dam.picture;
	},
	isSelectedEvent : function (id) {
		if(!Session.get("engagementOnCalendar")) { return }
		return Session.get("engagementOnCalendar")._id == id;
	},
	isCreator : function () {
		return Meteor.user() && this.createdBy == Meteor.userId();
	},
});