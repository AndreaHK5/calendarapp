function eventSubscription() {
    return [
        Meteor.subscribe("atgEvents"),
        Meteor.subscribe("atgEventTypes"),
        Meteor.subscribe("allProducts"),
        Meteor.subscribe("engineers"),
        Meteor.subscribe("dams"),
        Meteor.subscribe("developers"),
        Meteor.subscribe("publishers"),
        Meteor.subscribe("personTypes")
    ];
}

AtgEventsController = RouteController.extend({
	template : "atgEvents",
	subscriptions: function(){
		return [
			Meteor.subscribe("atgEvents"),
			Meteor.subscribe("atgEventTypes"),
			Meteor.subscribe("allProducts")
		];
	}
});

EventShowController = RouteController.extend({
	template : "atgEventShow",
	data : function () {
		return atgEvents.findOne({ _id : this.params._id});
	},
	subscriptions: eventSubscription,
    onBeforeAction : function () {
        if (!atgEvents.findOne({ _id : this.params._id})) {
            sAlert.warning("invalid event");
            this.render('notFound');
            return;
        }
        this.next();
    }
});

EventCreateController = RouteController.extend({
    template : "atgEventCreate",
    data : function () {
        return atgEventTypes.findOne({ _id : this.params._id});
    },
    subscriptions: eventSubscription,
    onBeforeAction : function () {
        if (!Meteor.userId()) {
            sAlert.error("must be logged in");
            this.render('notLoggedIn');
            return;
        }
        if (!atgEventTypes.findOne({ _id : this.params._id})) {
            sAlert.warning("invalid event type");
            this.render('notFound');
            return;
        }
        this.next();
    }
});

EventEditController = RouteController.extend({
	template : "atgEventEdit",
	data : function () {
		return atgEvents.findOne({ _id : this.params._id});
	},
	subscriptions: eventSubscription,
    onBeforeAction : function () {
        if (!Meteor.userId()) {
            sAlert.error("must be logged in");
            this.render('notLoggedIn');
        } else {
            this.next();
        }
    }
});