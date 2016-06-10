Template.atgEventSelectPerson.onRendered(function() {
    $('select.dropdown').dropdown();

    setTimeout(function (){
        reFillForm();
    },100);

    var newFields = {
        person: {
            identifier: 'person',
            rules: [
                {
                    type   : 'empty',
                    prompt : 'WHO\'s out'
                }
            ]
        }
    };

    atgEventsTemplateHelpers.addValidationsToForm(newFields);

});

Template.atgEventSelectPerson.helpers({
    getAllPeople : function () {
        return people.find();
    }
});

Template.atgEventSelectPerson.events({
    "change select[name=person]" : function (event) {
        atgEventsTemplateHelpers.updateNewEventDetails("personId", event.target.value);
    }
});


function reFillForm () {

    var newEvent = Session.get("newAtgEvent");
    if (!newEvent || !("eventDetails" in newEvent) || !newEvent.eventDetails.personId){
        return;
    }

    $("select[name=person]").dropdown("set selected", newEvent.eventDetails.personId);
}