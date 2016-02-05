Template.engagementDetailsCard.onRendered(function () {
	Meteor.subscribe("engineers");
	Meteor.subscribe("dams");
	Meteor.subscribe("gameTitles");
})

Template.engagementDetailsCard.helpers({
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
	createdBy : function () {
		var user = Meteor.users.findOne({_id : this.createdBy});
		if (!user) { 
			return false; 
		}
		return user.username;
	},
	getGameTitleProduct : function () {
		return GameTitles.findOne(this.gameTitle.id).product;
	},
	getGameTitlecCodename : function () {
		return GameTitles.findOne(this.gameTitle.id).codename;
	}
})