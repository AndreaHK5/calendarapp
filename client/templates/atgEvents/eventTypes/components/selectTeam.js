Template.atgEventSelectTeam.onRendered(function () {
    $('select.dropdown').dropdown();

    var newFields = {
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
    };

    atgEventsTemplateHelpers.addValidationsToForm(newFields);
    setTimeout(function (){
        reFillForm();
    },100)
});

Template.atgEventSelectTeam.helpers({
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
})

Template.atgEventSelectTeam.events({
    "change select[name=engineerGoing]" : function (event,context) {
        event.preventDefault();
        var engineersGoing = $(".ui.form")
            .find('[name="engineerGoing"] option:selected')
            .map(function (e,v) {
                return { id : v.value };
            }).get();
        atgEventsTemplateHelpers.updateNewEventDetails("engineersGoing", engineersGoing);
    },
    "change select[name=dam]" : function (event,context) {
        atgEventsTemplateHelpers.updateNewEventDetails("dam", { id : event.target.value });
    },
});

function reFillForm() {
    var newEvent = Session.get("newAtgEvent");
    if (!newEvent || !("eventDetails" in newEvent) || !newEvent.eventDetails.engineersGoing){
        return;
    }

    $("select[name=engineerGoing]").dropdown(
        "set selected",
        _.map(newEvent.eventDetails.engineersGoing,
            function (e) { return e.id; }
        )
    );
    $("select[name=dam]").dropdown("set selected",newEvent.eventDetails.dam.id);
}