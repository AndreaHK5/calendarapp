Template.engagementsCreateDetails.onRendered(function () {

    Session.set("customType", undefined);

    // activate dropdown
    $('select.dropdown').dropdown();
    // validations
    formValidations();
    // pre filled in case of back button

    Tracker.afterFlush(function () {
        reFillForm();
    });
    this.autorun(function () {
        Session.get("newAtgEvent");
        Session.get("eventRelationshipIds");
        clearValidations();
    })
})


Template.engagementsCreateDetails.helpers({
    getPartners: function () {
        // only the partners linked to a product are offered as options
        var relationshipIds = Session.get("eventRelationshipIds");

        // if no product yet, disable the dropdown.
        if (!relationshipIds || !relationshipIds.productId) {
            $(".partner-dropdown").addClass("disabled");
            return;
        }
        $(".partner-dropdown").removeClass("disabled");

        // getting partners that are either pubs of developers for the product
        // get devs array with _id, company Name and type
        var devs = partners.find({ _id : { $in : products.findOne({ _id: relationshipIds.productId })["developers"]}}).map(
            function (p) { return { _id : p._id, companyName : p.companyName, role : "Developer"}}
        );

        // get pubs array with _id, company Name and type
        var pubs = partners.find({ _id : { $in : products.findOne({ _id: relationshipIds.productId })["publishers"]}}).map(
            function (p) { return { _id : p._id, companyName : p.companyName, role : "Publisher"}}
        );

        // concat the two
        var activePartners = devs.concat(pubs);

        // see if the selected partner is there, otherwise restore default
        var selectedPartner = Session.get("eventRelationshipIds").partnerId;
        if (selectedPartner && !_.contains(_.map(activePartners, function (p) { return p._id}), selectedPartner)) {
            $(".ui.dropdown select[name='partner']").dropdown("restore defaults");
        }

        // return the concatenated array
        return activePartners;
    },
    getAllTypes: function () {
        // refactored to not iteratee due to underscore not having iteratee
        var types = _.uniq(
            atgEvents.find({ atgEventTypeId: atgEventTypes.findOne({ type: "Engagement" })["_id"] })
                .map(function (e) { return e.eventDetails.type; }));
        return _.map(types, function (t) { return { "type": t } });
    },
    getCustomType: function () {
        return Session.get("customType");
    },
    getAllGoals: function () {
        if (!Session.get("newAtgEvent")) { return; }
        var eventDetails = Session.get("newAtgEvent").eventDetails;
        if (!eventDetails || !("goals" in eventDetails)) { return; }
        return _.map(eventDetails.goals,
            function (goal) {
                return { goal: goal };
            });
    }
})


// filter partenrs by product as well (the association will be made by admin OR is it suppoed to be left free?)
// TODO filter people by product and, in the case there is only one DAM available, fill the field with that

Template.engagementsCreateDetails.events({
    "change select[name=partner]": function (event) {
        if (event.target.value == "") {
            return;
        }
        atgEventsTemplateHelpers.updateEventRelationsipIds("partnerId", event.target.value);
        $(".ui.dropdown select[name='partner']").dropdown('set selected', partners.findOne(event.target.value).companyName);
    },
    "change input[name=title]": function (event) {
        atgEventsTemplateHelpers.updateNewEventDetails("title", event.target.value);
    },
    "change select[name=type]": function (event) {
        atgEventsTemplateHelpers.updateNewEventDetails("type", event.target.value);
    },
    "change .type-dropdown input": function (event) {
        // this handler is required in order to allow addition of another custom event
        var newValue = event.target.value;
        Session.set("customType", newValue);
        // timeout left here as this functionality will be deleted
        setTimeout(function () {
            $(".ui.fluid.search.selection.dropdown.type-dropdown").dropdown('set selected', newValue);
        }, 10);
        event.preventDefault();
    },
    "change textarea[name=description]": function (event, context) {
        atgEventsTemplateHelpers.updateNewEventDetails("description", event.target.value);
    },
    "keydown input[name=goals]": function (event) {
        if (event.keyCode == 13) {
            // Enter has been pressed BUT we deactivated enter on the goals dropdown
            // and also we clear the errors
            event.preventDefault();
            addToGoals(event.target.value);
        }
    },
    "click .add-goal-button": function (event) {
        event.preventDefault();
        addToGoals($("input[name=goals]").val());
    },
    "click .remove-goal": function (event) {
        removeGoal($(event.target).attr('value'));
    },
    "blur input[name=goals]": function () {
        var inputValue = $('input[name=goals]').val();
        (inputValue == "" || inputValue == undefined) ? "" : addToGoals(inputValue);
    }
});

function reFillForm() {
    var engagementDetails = Session.get("newAtgEvent").eventDetails;
    if (!("goals" in engagementDetails)) {
        atgEventsTemplateHelpers.updateNewEventDetails("goals", []);
        return;
    }

    $("select[name=product]").dropdown("set selected",
        products.findOne({ _id: Session.get("eventRelationshipIds").productId }).title);

    Session.set("customType", engagementDetails.type);
    // todo make this happen in a callback
    Tracker.afterFlush(function () {
        $(".partner-dropdown").removeClass("disabled");
        $("select[name=partner]").dropdown("set selected", Session.get("eventRelationshipIds").partnerId);
        $("select[name=type]").dropdown("set selected", engagementDetails.type);  
    })

    $("input[name=title]").val(engagementDetails.title);
    $("textarea[name=description]").val(engagementDetails.description);
}

function addToGoals(newGoal) {
    if (newGoal == "" || newGoal == undefined) {
        return;
    }

    if (newGoal.length > 140) {
        sAlert.info("Please keep goals to a tweet.");
        return;
    }

    var goals = Session.get("newAtgEvent").eventDetails.goals;
    if (!goals) { goals = []; }
    if (_.contains(goals, newGoal)) {
        return;
    }
    goals.push(newGoal);
    atgEventsTemplateHelpers.updateNewEventDetails("goals", goals);
    $("input[name=goals]").val("")
}

function removeGoal(goal) {
    var goals = Session.get("newAtgEvent").eventDetails.goals;
    goals = _.without(goals, goal);
    atgEventsTemplateHelpers.updateNewEventDetails("goals", goals);
}

function clearValidations() {
    $('.form div').find('.error').removeClass('error');
    $('.form').find('.field.error').removeClass('error');
    $('.ui.error.message').empty();
}

function formValidations() {
    // custom validation
    $.fn.form.settings.rules.validateGoals = function () {
        return Session.get("newAtgEvent").eventDetails.goals.length != 0;
    };

    var newFields = {
        title: {
            identifier: 'title',
            rules: [
                {
                    type: 'empty',
                    prompt: 'We need a TITLE'
                }
            ]
        },
        type: {
            identifier: 'type',
            rules: [
                {
                    type: 'empty',
                    prompt: 'We need a TYPE'
                }
            ]
        },
        goals: {
            identifier: 'goals',
            rules: [
                {
                    type: 'validateGoals[]',
                    prompt: 'What are the GOALS'
                }
            ]
        },
        product: {
            identifier: 'product',
            rules: [
                {
                    type: 'empty',
                    prompt: 'Select a PRODUCT'
                }
            ]
        },
        partner: {
            identifier: 'partner',
            rules: [
                {
                    type: 'empty',
                    prompt: 'which PARTNER are we visiting?'
                }
            ]
        },
        description: {
            identifier: 'description',
            rules: [
                {
                    type: 'empty',
                    prompt: 'A few words would do as a DESCRIPTION'
                }
            ]
        },
        dam: {
            identifier: 'dam',
            rules: [
                {
                    type: 'minCount[1]',
                    prompt: 'Need a DAM'
                }
            ]
        },
        engineerGoing: {
            identifier: 'engineerGoing',
            rules: [
                {
                    type: 'minCount[1]',
                    prompt: "Who's going as ENIGNEER"
                }
            ]
        }
    };
    atgEventsTemplateHelpers.addValidationsToForm(newFields);
}

