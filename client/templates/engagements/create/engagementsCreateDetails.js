Template.engagementsCreateDetails.onRendered(function () {
  
  // set engagementBasic Details
	Session.set("engagementDetails", {
    startDate : Session.get("selectedStartDate"),
    endDate : Session.get("selectedEndDate"),
  });

  Session.set("customType", undefined);

  // animations
  var myDiv = $("#animationPlaceholder");
  myDiv.height($(window).height() - $(".confirm-jumbo").height());
  TweenLite.to(myDiv,0.8, {
    height: 0, 
    onComplete : function () {
      var h = $(window).height() - $('.confirm-jumbo').offset().top - 2 * $('.confirm-jumbo').height();
      $('.engagement-details-form').height(h)
    }
  });
  
  // subscriptions
  Meteor.subscribe("engineers");
  Meteor.subscribe("dams");
  Meteor.subscribe("engagements");
  Meteor.subscribe("gameTitles");

  // register validations
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
  }

})


Template.engagementsCreateDetails.events({
	"change input[name=title]" : function (event,context) {
		updateEventDetails("title", event.target.value);
	},
	"change select[name=type]" : function (event,context) {
		updateEventDetails("type", event.target.value);
	},
  "change .type-dropdown input" : function (event) {
    // this handler is required in order to allow addition of another custom event
    var newValue = event.target.value;
    Session.set("customType", newValue);
    setTimeout(function() {
      $(".ui.fluid.search.selection.dropdown").dropdown('set selected', newValue);
    }, 10);
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
        return { id : v.value }; 
      }).get();
    updateEventDetails("engineersGoing", engineersGoing);
	},
	"change select[name=dam]" : function (event,context) {
		updateEventDetails("dam", { id : event.target.value });
	},
  "change select[name=product]" : function (event) {
    updateEventDetails("gameTitle", { id : event.target.value });
    $(".ui.dropdown select[name='codename']").dropdown('set selected', GameTitles.findOne(event.target.value).codename);
  },
  "change select[name=codename]" : function (event) {
    updateEventDetails("gameTitle", { id : event.target.value });
    $(".ui.dropdown select[name='product']").dropdown('set selected', GameTitles.findOne(event.target.value).product);
  },
	"submit .form" : function (event) {
		if(!$('.ui.form').form('is valid')) { return };
		event.preventDefault();
		Session.set("formValid", true);
	}
})

function updateEventDetails (field, value) {
	var engagement = Session.get("engagementDetails");
	engagement[field] = value;
	Session.set("engagementDetails", engagement);
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
  $('select.dropdown').dropdown();
}

