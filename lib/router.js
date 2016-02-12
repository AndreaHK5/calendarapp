Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.onBeforeAction( loadEventsPerDay, { only : ['engagementsDash']});

Router.route("/",
	function() {
		this.layout("layout");
		this.render("engagementsDash", {to: "mainPane"});
		this.render('eventDay', {to: "dayTemplate"});
	}, 
	{  name: "engagementsDash" }
);

function loadEventsPerDay() {
	var months = Session.get("monthsShowing");
 	var last = mainHelpers.GetLastMonthShowing();
	var now =  mainHelpers.getTodayDate();
	var queryStartDate = now;
	var queryEndDate = moment(last.date).endOf('month');
	var engagementsPerDay = {};    
	Engagements.find(mainHelpers.betweenTwoDatesEngagementsQuery(queryStartDate, queryEndDate))   
	.forEach(function (e) {		        
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
}