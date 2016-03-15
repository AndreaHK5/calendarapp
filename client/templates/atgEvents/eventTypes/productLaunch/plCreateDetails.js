Template.plCreateDetails.onRendered(function () {
    Session.set("endDate", moment(Session.get("startDate")).endOf("Day").toISOString());
    formValidations();
    // pre filled in case of back button
    reFillForm();
});


Template.plCreateDetails.events({
    "change textarea[name=message]" : function (event) {
        atgEventsHelpers.updateEventDetails("message", event.target.value);
    },
});


function reFillForm () {
    var engagementDetails = Session.get("eventDetails");
    if (! ("message" in engagementDetails) ) { return ; }
    $("textarea[name=message]").val(engagementDetails.message);
    $("select[name=product]").dropdown("set selected",
        products.findOne({ _id : Session.get("eventRelationshipIds").productId}).title);
}


function formValidations () {
    $('.ui.form').form({
        fields: {
            message: {
                identifier: 'message',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'ANY details you can share?'
                    }
                ]
            }
        }
    });
}
