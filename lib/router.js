Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound'
});

Router.route('/', {
    name: 'atgEvents',
    template : "atgEvents",
    subscriptions: function(){
        return [
            Meteor.subscribe("atgEvents"),
            Meteor.subscribe("atgEventTypes"),
            Meteor.subscribe("allProducts")
        ];
    }});
Router.route('/:_id', {
    name: 'eventShow',
    template : "detailsCard",
    data : function () {
        return atgEvents.findOne({ _id : this.params._id});
    },
    subscriptions: function(){
        return [
            Meteor.subscribe("atgEvents"),
            Meteor.subscribe("atgEventTypes"),
            Meteor.subscribe("allProducts"),
            Meteor.subscribe("engineers"),
            Meteor.subscribe("dams"),
        ];
    }
});
Router.route('/:_id/edit', {
    name: 'eventEdit',
    template : "eventEdit",
    data : function () {
        return atgEvents.findOne({ _id : this.params._id});
    },
    subscriptions: function(){
        return [
            Meteor.subscribe("atgEvents"),
            Meteor.subscribe("atgEventTypes"),
            Meteor.subscribe("allProducts"),
            Meteor.subscribe("engineers"),
            Meteor.subscribe("dams"),
            Meteor.subscribe("developers"),
            Meteor.subscribe("publishers"),
        ];
    }
});


