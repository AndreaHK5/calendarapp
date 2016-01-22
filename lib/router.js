Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route("/", 
	function() {
		this.layout("layout");
		this.render("tripsIndex", {to: "mainPane"});
	}, 
	{
		name : 'tripsIndex'
	}
);

Router.route("/create", 
	function() {
		this.layout("layout");
		this.render("tripsCreate", {to: "mainPane"});
		this.render('calendarDay', {to: "dayTemplate"});
	}, 
	{
  		name: "tripsCreate"
	}
);

Router.route("/events",
	function() {
		this.layout("layout");
		this.render("eventsIndex", {to: "mainPane"});
		this.render('eventDay', {to: "dayTemplate"});
	}, 
	{
	  name: "eventsIndex"
	}
);