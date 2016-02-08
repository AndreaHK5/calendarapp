Template.engagementsCreateDetails.onRendered(function () {
  
  // set engagementBasic Details
	Session.set("engagementDetails", {
    startDate : Session.get("selectedStartDate"),
    endDate : Session.get("selectedEndDate"),
  });

  Session.set("customType", undefined);
  Session.set("goalsArray", []);
  Session.set("showGoalsHelper", undefined);

  // animations
  var myDiv = $("#animationPlaceholder");
  myDiv.height($(window).height() - $(".confirm-jumbo").height());
  TweenLite.to(myDiv,0.8, {
    height: 0, 
    onComplete : function () {
      var h = $(window).height() - $('.confirm-jumbo').offset().top - $('.confirm-jumbo').height();
      $('.engagement-details-form').height(h)
    }
  });
  
  // subscriptions
  Meteor.subscribe("engineers");
  Meteor.subscribe("dams");
  Meteor.subscribe("engagements");
  Meteor.subscribe("gameTitles");

  // activate dropdown
  $('select.dropdown').dropdown();
  formValidations();

})


Template.engagementsCreateDetails.helpers({
  getAllEngineers : function () {
  	return Engineers.find();
  },
  getAllDams : function () {
    return Dams.find();
  },
  getAllTypes : function () {
    return lodash.uniqBy( 
      Engagements.find().map(
        function (e) { 
          return { "type" : e.type};
        }), 
      lodash.iteratee("type"));
  },
  getCustomType : function () {
    return Session.get("customType");
  },
  getStartDate : function () {
      return Session.get("startDate");
  },
  getEndDate : function () {
      return Session.get("endDate");
  },
  getAllGameTitles : function () {
    return GameTitles.find();
  }, 
  getAllGoals : function () {
    return _.map(Session.get("goalsArray"), 
      function (goal) { 
        return { goal : goal }; 
      });
  },
  showGoalsHelper : function () {
    return Session.get("showGoalsHelper");
  }
})


Template.engagementsCreateDetails.events({
	"change input[name=title]" : function (event,context) {
		updateEngagementDetails("title", event.target.value);
	},
	"change select[name=type]" : function (event,context) {
		updateEngagementDetails("type", event.target.value);
	},
  "change .type-dropdown input" : function (event) {
    // this handler is required in order to allow addition of another custom event
    var newValue = event.target.value;
    Session.set("customType", newValue);
    setTimeout(function() {
      $(".ui.fluid.search.selection.dropdown.type-dropdown").dropdown('set selected', newValue);
    }, 10);
    event.preventDefault();
  },
	"change textarea[name=description]" : function (event,context) {
		updateEngagementDetails("description", event.target.value);
	},
	"change select[name=engineerGoing]" : function (event,context) {
    event.preventDefault();
		// TODO this is a terryfying wasy of doign two way binding, find a better one!
    var engineersGoing = $(".ui.form")
      .find('[name="engineerGoing"] option:selected')
      .map(function (e,v) {  
        return { id : v.value }; 
      }).get();
    updateEngagementDetails("engineersGoing", engineersGoing);
	},
	"change select[name=dam]" : function (event,context) {
		updateEngagementDetails("dam", { id : event.target.value });
	},
  "change select[name=product]" : function (event) {
    updateEngagementDetails("gameTitle", { id : event.target.value });
    $(".ui.dropdown select[name='codename']").dropdown('set selected', GameTitles.findOne(event.target.value).codename);
  },
  "change select[name=codename]" : function (event) {
    updateEngagementDetails("gameTitle", { id : event.target.value });
    $(".ui.dropdown select[name='product']").dropdown('set selected', GameTitles.findOne(event.target.value).product);
  },
  "change select[name=goals]" : function (event) {
    var selectedGoals = $(".ui.form").find('[name="goals"] option:selected').map(function (e,v) { return v.value; } ).get();
    updateEngagementDetails("goals", selectedGoals);
  },
  "keydown .goals-dropdown input" : function (event) {
    if (event.keyCode == 13) {
      // Enter has been pressed BUT we deactivated enter on the goals dropdown
      // and also we clear the errors
      event.preventDefault();
      addToGoals(event.target.value);
      clearValidations();
    }
  },
  "focus .goals-dropdown input" : function () {
    // show the helper message on the goals.
    Session.set("showGoalsHelper", true);
    
    clearTimeout(goalsHelperTimer); 
    goalsHelperTimer = setTimeout(function() {
      Session.set("showGoalsHelper", false);
    }, 5000);
  },
  "blur .goals-dropdown input" : function (event) {
    // hide the helper message for the goals, if showing;
    clearTimeout(goalsHelperTimer);
    Session.set("showGoalsHelper", false);
    addToGoals(event.target.value);
  },
	"submit .ui.form" : function (event) {
    event.preventDefault();
    clearValidations();
	},
  "click .confirm-button" : function (event) { 
    $('.ui.form').form('validate form');
    if(!$('.ui.form').form('is valid')) { return };
    Session.set("formValid", true);
  }
});

var goalsHelperTimer;

function addToGoals(newGoal) {
  var goals = Session.get("goalsArray");
  if(_.contains(goals, newGoal)) { 
    sAlert.info("We already have that goal. It's important - got it =)")
    return ;
  }
  goals.push(newGoal);
  Session.set("goalsArray", goals);
  setTimeout(function() {
    $(".goals-dropdown input").val("");
    $(".ui.dropdown select[name='goals']").dropdown('set selected', newGoal);
  }, 10);
}


function updateEngagementDetails (field, value) {
	var engagement = Session.get("engagementDetails");
	engagement[field] = value;
	Session.set("engagementDetails", engagement);
}

function clearValidations() {
  $('.form div').find('.error').removeClass('error');
  $('.ui.error.message').empty()
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
    goals: {
      identifier: 'goals',
      rules: [
        {
          type   : 'minCount[1]',
          prompt : 'What are the GOALS'
        }
      ]
    },
    product: {
      identifier: 'product',
      rules: [
        {
          type   : 'empty',
          prompt : 'Select GAME TITLE'
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
}

