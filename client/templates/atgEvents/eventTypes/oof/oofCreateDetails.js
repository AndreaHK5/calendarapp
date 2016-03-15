Template.oofCreateDetails.onRendered(function () {
    // activate dropdown
    $('select.dropdown').dropdown();
    Meteor.subscribe("engineers");
    Meteor.subscribe("dams");

    formValidations();
    // pre filled in case of back button
    reFillForm();
});

Template.oofCreateDetails.helpers({
    getAllPeople : function () {
        return people.find();
    }
});

Template.oofCreateDetails.events({
    "change select[name=person]" : function (event) {
        atgEventsHelpers.updateEventDetails("personId", event.target.value);
    },
    "change textarea[name=message]" : function (event) {
        atgEventsHelpers.updateEventDetails("message", event.target.value);
    },
})

function reFillForm () {
    var engagementDetails = Session.get("eventDetails");
    if (! ("personId" in engagementDetails) ) { return ; }

    $("select[name=person]").dropdown("set selected",engagementDetails.personId);
    $("textarea[name=message]").val(engagementDetails.message);
}


function formValidations () {
    $('.ui.form').form({
        fields: {
            person: {
                identifier: 'person',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'WHO\'s out'
                    }
                ]
            }
        }
    });
}
