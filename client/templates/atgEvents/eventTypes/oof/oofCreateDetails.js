Template.oofCreateDetails.onRendered(function () {
    Tracker.afterFlush(function () {
        reFillForm();
    });
    // reset the validations
    atgEventsTemplateHelpers.addValidationsToForm({});
});

Template.oofCreateDetails.events({
    "change textarea[name=message]" : function (event) {
        atgEventsTemplateHelpers.updateNewEventDetails("message", event.target.value);
    },
})

function reFillForm () {
    var newEvent = Session.get("newAtgEvent");
    if (!newEvent || !("eventDetails" in newEvent) || !newEvent.eventDetails.message){
        return;
    }
    $("textarea[name=message]").val(newEvent.eventDetails.message);
}