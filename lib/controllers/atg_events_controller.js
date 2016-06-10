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

function notLoggedIn() {
    if (!Meteor.userId()) {
        sAlert.error("must be logged in");
        this.render('notLoggedIn');
    } else {
        this.next();
    }
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
	subscriptions: eventSubscription
});

EventCreateController = RouteController.extend({
    template : "atgEventCreate",
    data : function () {
        return atgEventTypes.findOne({ _id : this.params._id});
    },
    subscriptions: eventSubscription,
    onBeforeAction : notLoggedIn
});

EventEditController = RouteController.extend({
	template : "atgEventEdit",
	data : function () {
		return atgEvents.findOne({ _id : this.params._id});
	},
	subscriptions: eventSubscription,
    onBeforeAction : notLoggedIn
});