
UI.registerHelper("getQuarter", function (unixDate) {
    return moment(unixDate).quarter();
});


UI.registerHelper("getYear", function (unixDate) {
    return moment(unixDate).year();
});

UI.registerHelper("getPersonData", function (id) {
    var person = people.findOne({_id : id});
    if (!person) {return ;}
    // this is required to update the sematic UP pop up
    Session.set("popupAdded", new Date());
    return person;
});

UI.registerHelper("getAtgEventTypeName", function (atgEventTypeId) {
    if (atgEventTypeId) {
        return atgEventTypes.findOne({_id : atgEventTypeId}).type;
    }
});


UI.registerHelper("getEngagementTypeColor", function (engagementType) {
    // safe method in case a new type is provided
    if (engagementType == null) {
        return;
    }
    // the ID may be passed in.
    var atgEventType = atgEventTypes.findOne({ _id : engagementType});
    if (atgEventType){
        engagementType = atgEventType.type;
    }
    engagementType = engagementType.toLowerCase();

    return eventTypeSettings[engagementType].colorMapping;

});

// universal helpers
Template.registerHelper('equals',
    function(v1, v2) {
        return (v1 === v2);
    }
);