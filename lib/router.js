Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route("/", 
	function() {
		this.layout("layout");
		this.render("engagementsList", {to: "mainPane"});
	}, 
	{ name : 'engagementsList' }
);

Router.route("/create", 
	function() {
		this.layout("layout");
		this.render("engagementsCreate", {to: "mainPane"});
		this.render('calendarDay', {to: "dayTemplate"});
	}, 
	{ name: "engagementsCreate" }
);

Router.route("/dash",
	function() {
		this.layout("layout");
		this.render("engagementsDash", {to: "mainPane"});
		this.render('eventDay', {to: "dayTemplate"});
	}, 
	{  name: "engagementsDash" }
);