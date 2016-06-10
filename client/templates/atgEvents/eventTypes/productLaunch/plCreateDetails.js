Template.plCreateDetails.onRendered(function () {
    formValidations();
    Tracker.afterFlush(function () {
        reFillForm();
    });
});


Template.plCreateDetails.events({
    "change textarea[name=message]" : function (event) {
        atgEventsTemplateHelpers.updateNewEventDetails("message", event.target.value);
    },
});


function reFillForm () {
    var newEvent = Session.get("newAtgEvent");
    if (!newEvent || !("eventDetails" in newEvent) || !newEvent.eventDetails.message){
        return;
    }
    $("textarea[name=message]").val(newEvent.eventDetails.message);
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
        }
    });
}
