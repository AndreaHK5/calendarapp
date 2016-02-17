Template.engagementsCreateDetails.onRendered(function () {
  
  Session.set("customType", undefined);

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
  // validations
  formValidations();
  // pre filled in case of back button
  reFillForm();

  this.autorun(function () {
    Session.get("engagementDetails");
    clearValidations();
  })
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
    if (!Session.get("engagementDetails")) { return; }
    return _.map(Session.get("engagementDetails").goals, 
      function (goal) { 
        return { goal : goal }; 
      });
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
    // timeout left here as this functionality will be deleted
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
  "keydown input[name=goals]" : function (event) {
    if (event.keyCode == 13) {
      // Enter has been pressed BUT we deactivated enter on the goals dropdown
      // and also we clear the errors
      event.preventDefault();
      addToGoals(event.target.value);
      clearValidations();
    }
  },
  "click .add-goal-button" : function (event) {
    event.preventDefault();
    addToGoals($("input[name=goals]").val());
  },
  "click .remove-goal" : function (event) {
    removeGoal($(event.target).attr('value'));
  },
	"submit .ui.form" : function (event) {
    event.preventDefault();
    clearValidations();
	},
  "click .confirm-details" : function (event) { 
    addToGoals($('input[name=goals]').val());
    $('.ui.form').form('validate form');
    if(!$('.ui.form').form('is valid')) { return };

    // in case there is a value in the goals, this needs to be included in the engagement object
    mainHelpers.scrollPlaceholderOut().then(function () {
      Session.set("formValid", true);              
    });
  }
});


function reFillForm () {
  var engagementDetails = Session.get("engagementDetails");
  if (! ("title" in engagementDetails) ) { return ; } 
  $("select[name=product]").dropdown("set selected",
    GameTitles.findOne({ _id : engagementDetails.gameTitle.id}).product);
  $("input[name=title]").val(engagementDetails.title);
  Session.set("customType", engagementDetails.type);
  $("select[name=type]").dropdown("set selected",engagementDetails.type);
  $("textarea[name=description]").val(engagementDetails.description);
  $("select[name=engineerGoing]").dropdown(
    "set selected", 
    _.map(engagementDetails.engineersGoing, 
        function (e) { return e.id; } 
    )
  );

  $("select[name=dam]").dropdown("set selected",engagementDetails.dam.id);

}


function addToGoals(newGoal) {
  if (newGoal == "" || newGoal == undefined) {
    sAlert.info("Type your goal in the box, them press ENTER to add it.");
    return;
  }

  if (newGoal.length > 140) {
    sAlert.info("Please keep goals to a tweet.");
    return;    
  }

  var goals = Session.get("engagementDetails").goals;
  if(_.contains(goals, newGoal)) { 
    sAlert.info("We already have that goal. It's important - got it.")
    return ;
  }
  goals.push(newGoal);
  updateEngagementDetails("goals", goals );
  $("input[name=goals]").val("")
}

function removeGoal(goal) {
  var goals = Session.get("engagementDetails").goals;
  lodash.remove(goals, function (g) { return g == goal;} );
  updateEngagementDetails("goals", goals );
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
  // custom validation
  $.fn.form.settings.rules.validateGoals = function() {
    return Session.get("engagementDetails").goals.length != 0; 
  }


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
          type   : 'validateGoals[]',
          prompt : 'What are the GOALS?'
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

