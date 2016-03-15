Template.eventsCreateSelectType.helpers({
    getAllTypes : function () {
        return atgEventTypes.find();
    },
    typeSelected : function() {
        return Session.get("atgEventTypeId");
    },
    getSelectedType : function () {
        return atgEventTypes.findOne({ _id : Session.get("atgEventTypeId")}).type;
    }
})

Template.eventsCreateSelectType.events({
    "click .select-type": function () {
        var id = this._id;
        atgEventsHelpers.hideSelectTypeContainer().then(function () {
            Session.set("atgEventTypeId", id);
        });
    }
});