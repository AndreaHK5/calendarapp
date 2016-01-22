// FlowRouter.configure({
//   layoutTemplate: 'layout',
//   loadingTemplate: 'loading',
//   notFoundTemplate: 'notFound'
// });

FlowRouter.route("/", {
	name: 'home',
	action : function() {
		BlazeLayout.render('layout', { mainPane : "tripsIndex"});
	}
});

FlowRouter.route("/create", {
	name: 'create',
	action : function() {
		BlazeLayout.render('layout', { mainPane : "tripsCreate", dayCard : 'calendarDay'});
	}
});

FlowRouter.route("/events", {
	name: 'events',
	action : function() {
		BlazeLayout.render('layout', {mainPane : "tripsCreate", dayCard : "eventDay"});
	}
});