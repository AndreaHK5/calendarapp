function notLoggedIn() {
    if (!Meteor.userId()) {
        sAlert.error("must be logged in");
        this.render('notLoggedIn');
    } else {
        this.next();
    }
}

PartnersController = RouteController.extend({
    template : "partnersList",
    subscriptions: function(){
        return [
            Meteor.subscribe("publishers"),
            Meteor.subscribe("developers"),
        ];
    }
});

PartnerShowController = RouteController.extend({
    template : "partnerShow",
    data : function () {
        var partner = partners.findOne({ _id : this.params._id});
        if (!partner) {
            this.render('notFound');
        } else {
            return partner;
        }
    },
    subscriptions: function(){
        return [
            Meteor.subscribe("publishers"),
            Meteor.subscribe("developers"),
            Meteor.subscribe("partnerTypes"),
            Meteor.subscribe("atgEvents"),
            Meteor.subscribe("atgEventTypes"),
        ];
    }
});


PartnerEditController = RouteController.extend({
    template : "partnerUpsert",
    data : function () {
        var partner = partners.findOne({ _id : this.params._id});
        if (!partner) {
            this.render('notFound');
        } else {
            return partner;
        }
    },
    onBeforeAction : notLoggedIn,
    subscriptions: function(){
        return [
            Meteor.subscribe("publishers"),
            Meteor.subscribe("developers"),
            Meteor.subscribe("partnerTypes"),
        ];
    }
});

PartnerCreateController = RouteController.extend({
    template : "partnerUpsert",
    onBeforeAction : notLoggedIn,
    subscriptions: function(){
        return [
            Meteor.subscribe("partnerTypes"),
        ];
    }
});
