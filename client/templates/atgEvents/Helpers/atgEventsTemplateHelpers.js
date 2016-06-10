if (Meteor.isClient) {
    // all helpers for use in Templates are encapsulated in an object for reference
    atgEventsTemplateHelpers = {};

    // helpers for front end controllers

    atgEventsTemplateHelpers.getTodayDate = function() {
        return moment().startOf('day');
    };

    atgEventsTemplateHelpers.GetLastMonthShowing = function () {
        var months = Session.get("monthsShowing");
        var maxUnix = _.map(months, function (m) { return moment(m.date).unix()})
        return moment.unix(_.max(maxUnix));
    };

    atgEventsTemplateHelpers.betweenTwoDatesEngagementsQuery = function (queryStartDate, queryEndDate) {
        return { $and :[
            {
                "startDate" : {$lte :  queryEndDate.toISOString() }
            },
            {
                "endDate" : {$gte : queryStartDate.toISOString()  }
            }
        ]
        };
    };

    atgEventsTemplateHelpers.betweenDatesAndTypeEngagementsQuery = function (queryStartDate, queryEndDate, type) {
        var query = atgEventsTemplateHelpers.betweenTwoDatesEngagementsQuery(queryStartDate, queryEndDate);
        query[$and].push({type : type});
        return query;
    };

    /**
     * adds to the .ui.form the required validations (otherwise they are overwritten
     * @param newFields to be added to the validation
     */
    atgEventsTemplateHelpers.addValidationsToForm = function (newFields) {
        var currentFields = $('.ui.form').form('setting', 'fields');
        $('.ui.form').form({ fields: $.extend(true, currentFields, newFields)});
    }

    /**
     * ENUM to share where the create process is
     * @type {{selectTeam: number, selectDates: number, details: number, confirm: number}}
     */
    atgEventsTemplateHelpers.createSteps = {
        selectTeam : 0,
        selectDates : 1,
        details : 2,
        confirm : 3
    };

    /**
     * Updates the event details of the "newAtgEvent" in session.
     * @param field the field to modify
     * @param value the new value for the field
     */
    atgEventsTemplateHelpers.updateNewEventDetails = function(field, value) {
        var engagement = Session.get("newAtgEvent");
        engagement.eventDetails[field] = value;
        Session.set("newAtgEvent", engagement);
    };

    /**
     * updates the "newAtgEvent" in session
     * @param field the field to modify
     * @param value the new value for the field
     */
    atgEventsTemplateHelpers.updateEvent = function(field, value) {
        var newEvent = Session.get("newAtgEvent");
        newEvent[field] = value;
        Session.set("newAtgEvent", newEvent );
    }

    atgEventsTemplateHelpers.updateEventRelationsipIds = function (field, value) {
        var relIds = Session.get("eventRelationshipIds");
        if (!relIds) {
            relIds = {};
        }
        relIds[field] = value;
        Session.set("eventRelationshipIds", relIds);
    };

    //  +++++++++++++++++++++ TEMPLATING SERVICES

    // accepts both ID and type
    atgEventsTemplateHelpers.getTemplateForType = function (type, templateType) {

        var atgEventType = atgEventTypes.findOne({ _id : type});
        var typename;
        if (atgEventType){
            typename = atgEventType.type;
        } else {
            typename = type;
        }

        if (!typename) { return; }

        if (!(typename.toLowerCase() in eventTypeSettings) || !(templateType in eventTypeSettings[typename.toLowerCase()]))  {
            var msg = "template " + templateType + " not mapped for " + type;
            console.log(msg);
            throw new Meteor.Error(msg);
        }

        return eventTypeSettings[typename.toLowerCase()][templateType];
    };
}