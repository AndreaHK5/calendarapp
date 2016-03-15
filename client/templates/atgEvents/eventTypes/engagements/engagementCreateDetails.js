Template.engagementsCreateDetails.onRendered(function () {

    Session.set("customType", undefined);

    // subscriptions
    Meteor.subscribe("personTypes");
    Meteor.subscribe("engineers");
    Meteor.subscribe("dams");
    Meteor.subscribe("engagements");
    Meteor.subscribe("allProducts");
    Meteor.subscribe('developers');
    Meteor.subscribe('publishers');

    // activate dropdown
    $('select.dropdown').dropdown();
    // validations
    formValidations();
    // pre filled in case of back button
    reFillForm();

    var eventDetails = Session.get("eventDetails");
    if (!("goals" in eventDetails)) {
        eventDetails.goals = [];
        Session.set("eventDetails", eventDetails);
    }

    this.autorun(function () {
        Session.get("eventDetails");
        clearValidations();
    })
})


Template.engagementsCreateDetails.helpers({
    getPartners : function () {
        var relationshipIds = Session.get("eventRelationshipIds");

        if (!relationshipIds|| !relationshipIds.productId ) {
            $(".partner-dropdown").addClass("disabled");
            return ;
        }
        $(".partner-dropdown").removeClass("disabled");

        // getting partners that are either pubs of developers for the product
        var activePartners = _.uniq(
            _.concat(
                products.findOne({_id : relationshipIds.productId})["developers"],
                products.findOne({_id : relationshipIds.productId})["publishers"])
        );

        var selectedPartner = Session.get("eventRelationshipIds").partnerId;
        if ( selectedPartner && !_.includes(activePartners, selectedPartner)) {
            $(".ui.dropdown select[name='partner']").dropdown("restore defaults");
        }

        return partners.find({ _id : {$in : activePartners}});
    },
    getRoleForPartner : function (optionid) {
        return _.includes(products.findOne({_id : Session.get("eventRelationshipIds").productId})["developers"], optionid) ? "Developer" : "Publisher";
    },
    getAllEngineers : function () {
        var engineerType = personTypes.findOne({ title : "Engineer"});
        if (!engineerType) { return; }
        return people.find(
            { personTypeIds : engineerType._id}
        );
    },
    getAllDams: function () {
        var damType = personTypes.findOne({ title : "Dam"});
        if (!damType) {return ;}
        return people.find(
            { personTypeIds : damType._id }
        );
    },
    getAllTypes : function () {

        return lodash.uniqBy(
            atgEvents.find({
                atgEventTypeId : atgEventTypes.findOne({type : "Engagement"})["_id"]
            })
                .map(
                    function (e) {
                        return { "type" : e.eventDetails.type};
                    }
                ),
            lodash.iteratee("type"));
    },
    getCustomType : function () {
        return Session.get("customType");
    },
    getAllGoals : function () {
        var eventDetails = Session.get("eventDetails");
        if (!eventDetails) { return; }
        return _.map(eventDetails.goals,
            function (goal) {
                return { goal : goal };
            });
    }
})


// filter partenrs by product as well (the association will be made by admin OR is it suppoed to be left free?)
// TODO filter people by product and, in the case there is only one DAM available, fill the field with that

Template.engagementsCreateDetails.events({
    "change select[name=partner]" : function (event) {
        if(event.target.value == "") {
            return;
        }
        atgEventsHelpers.updateEventRelationsipIds("partnerId", event.target.value);
        $(".ui.dropdown select[name='partner']").dropdown('set selected', partners.findOne(event.target.value).companyName);
    },
    "change input[name=title]" : function (event) {
        atgEventsHelpers.updateEventDetails("title", event.target.value);
    },
    "change select[name=type]" : function (event) {
        atgEventsHelpers.updateEventDetails("type", event.target.value);
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
        atgEventsHelpers.updateEventDetails("description", event.target.value);
    },
    "change select[name=engineerGoing]" : function (event,context) {
        event.preventDefault();
        var engineersGoing = $(".ui.form")
            .find('[name="engineerGoing"] option:selected')
            .map(function (e,v) {
                return { id : v.value };
            }).get();
        atgEventsHelpers.updateEventDetails("engineersGoing", engineersGoing);
    },
    "change select[name=dam]" : function (event,context) {
        atgEventsHelpers.updateEventDetails("dam", { id : event.target.value });
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
    "blur input[name=goals]": function() {
        var inputValue = $('input[name=goals]').val();
        (inputValue == "" || inputValue == undefined) ? "" : addToGoals(inputValue);
    }
});

function reFillForm () {
    var engagementDetails = Session.get("eventDetails");
    if (! ("title" in engagementDetails) ) { return ; }

        $("select[name=product]").dropdown("set selected",
            products.findOne({ _id : Session.get("eventRelationshipIds").productId}).title);

    // todo make this happen in a callback
    setTimeout( function () {
        $(".partner-dropdown").removeClass("disabled");
        $("select[name=partner]").dropdown("set selected", Session.get("eventRelationshipIds").partnerId);
        $("select[name=engineerGoing]").dropdown(
            "set selected",
            _.map(engagementDetails.engineersGoing,
                function (e) { return e.id; }
            )
        );
        $("select[name=dam]").dropdown("set selected",engagementDetails.dam.id);
    }, 200);

    $("input[name=title]").val(engagementDetails.title);
    Session.set("customType", engagementDetails.type);
    $("select[name=type]").dropdown("set selected",engagementDetails.type);
    $("textarea[name=description]").val(engagementDetails.description);

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

    var goals = Session.get("eventDetails").goals;
    if(lodash.includes(goals, newGoal)) {
        sAlert.info("We already have that goal. It's important - got it.")
        return ;
    }
    goals.push(newGoal);
    atgEventsHelpers.updateEventDetails("goals", goals );
    $("input[name=goals]").val("")
}

function removeGoal(goal) {
    var goals = Session.get("eventDetails").goals;
    lodash.remove(goals, function (g) { return g == goal;} );
    atgEventsHelpers.updateEventDetails("goals", goals );
}

function clearValidations() {
    $('.form div').find('.error').removeClass('error');
    $('.ui.error.message').empty()
}

function formValidations () {
    // custom validation
    $.fn.form.settings.rules.validateGoals = function() {
        return Session.get("eventDetails").goals.length != 0;
    }

    // TODO consider validations conditional to the presence of developer for a product!
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
                        prompt : 'What are the GOALS'
                    }
                ]
            },
            product: {
                identifier: 'product',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'Select a PRODUCT'
                    }
                ]
            },
            partner: {
                identifier: 'partner',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'which PARTNER are we visiting?'
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

