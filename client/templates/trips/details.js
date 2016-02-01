Template.eventDetails.onRendered(function () {
	Session.set("eventDetails", {});
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
		// validations will go here
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
		// is the data cmoing in in the form at submit?
		updateEventDetails("engineersGoing", [JSON.parse(event.target.value)]);
	},
	"change select[name=dam]" : function (event,context) {
		// TODO ditto!
		updateEventDetails("dam", JSON.parse(event.target.value));
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
	//Session.set("formValid", $('.ui.form').form('is valid'));	
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
            		type   : 'empty',
            		prompt : 'Need a DAM'
          		}
        	]
      	},
		engineerGoing: {
        	identifier: 'engineerGoing',
        	rules: [
          		{
            		type   : 'empty',
            		prompt : "Who's going as ENIGNEER"
          		}
        	]
      	}
    }
  });
}

