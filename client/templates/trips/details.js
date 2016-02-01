Template.eventDetails.onRendered(function () {
	Session.set("eventDetails", {
    startDate : Session.get("selectedStartDate"),
    endDate : Session.get("selectedEndDate"),
  });
	formValidations();
  var myDiv = $("#animationPlaceholder");
  myDiv.height($(window).height() - $(".confirm-jumbo").height());
  TweenLite.to(myDiv,0.8, {height: 0});
})


Template.eventDetails.helpers({
  getAllEngineers : function () {
  	getAllDistinctInEvents("engineersGoing",function (err,res) {
  		Session.set("allEngineers", res);
  	});
  	return Session.get("allEngineers");
  },
   getAllTypes : function () {
  	getAllDistinctInEvents("type",function (err,res) {
  		if (err) {
  			console.log(err);
  			return;
  		}
  		Session.set("allTypes", _.map(res, function (e) {return {eventType : e}}));
  	});
  	return Session.get("allTypes");
  }
})


Template.eventDetails.events({
	"change input[name=title]" : function (event,context) {
		updateEventDetails("title", event.target.value);
	},
	"change select[name=type]" : function (event,context) {
		updateEventDetails("type", event.target.value);
	},
	"change textarea[name=description]" : function (event,context) {
		updateEventDetails("description", event.target.value);
	},
	"change select[name=engineerGoing]" : function (event,context) {
		// TODO this is a terryfying wasy of doign two way binding, find a better one!
    var engineersGoing = $(".ui.form")
      .find('[name="engineerGoing"] option:selected')
      .map(function (e,v) {
        // TODO make a collection of engineers and get by ID!  
        return _.find(Session.get("allEngineers"), function (g) {return g.name == v.value })
      }).get();
    updateEventDetails("engineersGoing", engineersGoing);
	},
	"change select[name=dam]" : function (event,context) {
    var dam = _.find(Session.get("allEngineers"), function (g) {return g.name == event.target.value });
		updateEventDetails("dam", dam);
	},
	"submit .form" : function (event) {
		if(!$('.ui.form').form('is valid')) { return };
		event.preventDefault();
		Session.set("formValid", true);
	}
})

function updateEventDetails (field, value) {
	var eventL = Session.get("eventDetails");
	eventL[field] = value;
	Session.set("eventDetails", eventL);
}

function formValidations () {
	$('.ui.form').form({
	fields: {
     	title: {
        	identifier: 'title',
        	rules: [
          		{
            		type   : 'empty',
            		prompt : 'We need a TITLE'
          		}
        	]
      	},
		type: {
        	identifier: 'type',
        	rules: [
          		{
            		type   : 'empty',
            		prompt : 'We need a TYPE'
          		}
        	]
      	},
		description: {
        	identifier: 'description',
        	rules: [
          		{
            		type   : 'empty',
            		prompt : 'A few words would do as a DESCRIPTION'
          		}
        	]
      	},
		dam: {
        	identifier: 'dam',
        	rules: [
          		{
            		type   : 'minCount[1]',
            		prompt : 'Need a DAM'
          		}
        	]
      	},
		engineerGoing: {
        	identifier: 'engineerGoing',
        	rules: [
          		{
            		type   : 'minCount[1]',
            		prompt : "Who's going as ENIGNEER"
          		}
        	]
      	}
    }
  });
  $('select.dropdown').dropdown();
}

