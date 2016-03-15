Template.engagementBriefCard.onRendered( function () {
    this.autorun(function () {
		Session.get("popupAdded");
		Tracker.afterFlush(function () {
			$('.ui.avatar.image').popup();			
		})
	});
})

Template.engagementBriefCard.helpers({
    getProduct : function () {
		return products.findOne({events : this._id} );
	},
	getPersonData : function (id) {
		var person = people.findOne({_id : id});
		if (!person) {return ;}
		Session.set("popupAdded", new Date());
		return  person;
	},
	getPartnerCompanyName : function () {
        var partner = partners.findOne({events : this._id} );
        if(partner) {
            return partner.companyName;
        }
    },
});