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



Router.onBeforeAction(function () {
		var months = Session.get("monthsShowing");
	 	var last = mainGetLastMonthShowing();

		var now =  getTodayDate();
		var queryStartDate = now;
		var queryEndDate = moment(last).endOf('month');
		var engagementsPerDay = {};    
		Engagements.find(betweenTwoDatesEventsQuery(queryStartDate, queryEndDate))   
		.forEach(function (e) {		        
			// TODO move this to the mongo query! 
	        // TODO add unit test of this mostruosity
	        // startign form the beginning of the engagement or of the query (and same for ending)
	        var startLoop = moment.max(moment(e.startDate), moment(queryStartDate));
	        var endLoop = moment.min(moment(e.endDate), moment(queryEndDate));
	        var type = e.type;			
	        for(var m = startLoop; !m.isAfter(endLoop);  m.add('days',1)) {
	          var isoDay = m.toISOString();
	          // initailize objects if not present
	          if (! (isoDay in engagementsPerDay)) { engagementsPerDay[isoDay] = {}; } 
	          if (! (type in engagementsPerDay[isoDay])) { engagementsPerDay[isoDay][type] = 0 }
	          engagementsPerDay[isoDay][type] ++;
	        }
	    });
	    Session.set("engagementsPerDay", engagementsPerDay);
	    this.next();

});