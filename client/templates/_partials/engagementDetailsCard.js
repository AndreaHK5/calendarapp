Template.engagementDetailsCard.onRendered(function () {
	Meteor.subscribe("engineers");
	Meteor.subscribe("dams");
})

Template.engagementDetailsCard.helpers({
	getEngineerPicture : function (id) {
		return Engineers.findOne({_id : id}).picture;
	},
	getDamPicture : function (id) {
		return Dams.findOne({_id : id}).picture;
	} 
})