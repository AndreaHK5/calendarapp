if (Meteor.isClient) {

    upsertAtgEvent = function (atgEvent, relationshipIds, next) {
        check(atgEvent, Object);
        check(relationshipIds, Object);
        var selectedType = atgEventTypes.findOne({_id: atgEvent.atgEventTypeId}).type;
        switch (selectedType.toLowerCase()) {
            case "engagement" :
                Meteor.call("upsertEngagement", atgEvent, relationshipIds, next);
                break;
            case "out of office" :
                Meteor.call("saveOof", atgEvent, next);
                break;
            case "product launch" :
                Meteor.call("upsertPl", atgEvent,relationshipIds, next);
                break;
        }
    };

    removeAtgEvent = function (id, next) {
        check(id, String);
        Meteor.call("removeAtgEvent", id, next);
    };
}

if (Meteor.isServer) {
    Meteor.methods({
        upsertEngagement : function (atgEvent, relationshipIds) {
            // general checks
            check( atgEvent, Object);
            check( relationshipIds, {
                partnerId: String,
                productId: String
            });

            // check that user is logged in
            if (! Meteor.userId()) {
                throw new Meteor.Error("Cannot save engagment for not user logged in");
            }

            // validation of partnerId and productId
            var partner = partners.findOne({_id : relationshipIds.partnerId});
            var product = products.findOne({_id : relationshipIds.productId});
            if (!partner) {
                throw new Meteor.Error("Cannot save event, invalid partner");
            }
            if (!product) {
                throw new Meteor.Error("Cannot save event, invalid product");
            }

            // validate that productId has the selected partnerId, otherwise throw
            if (!_.contains(product.developers, relationshipIds.partnerId) && !_.contains(product.publishers, relationshipIds.partnerId)) {
                throw new Meteor.Error("Product " + product.title + " is not associated with partner " + partner.companyName );
            }

            validateAtgEventDetails(atgEvent);

            var result;
            if ("_id" in atgEvent) {
                if (Meteor.userId() != atgEvents.findOne({ _id : atgEvent._id}).createdBy ) {
                    throw new Meteor.Error("cannot edit other user's event");
                }
                // update the event
                result = atgEvents.update(
                    {_id : atgEvent._id},
                    { $set : {
                        eventDetails: atgEvent.eventDetails,
                        startDate: atgEvent.startDate,
                        endDate: atgEvent.endDate
                    }
                    }
                );

                // update the association

                partners.update(
                    { events : atgEvent._id},
                    { $pull : { events : atgEvent._id} },
                    {validate : false},
                    function () {
                        associatePartner(undefined, atgEvent._id, relationshipIds.partnerId);
                    }
                );

                products.update(
                    { events : atgEvent._id},
                    { $pull : { events : atgEvent._id} },
                    {validate : false},
                    function () {
                        associateProduct(undefined, atgEvent._id, relationshipIds.productId);
                    }
                );
            } else {
                // create event
                result = atgEvents.insert(
                    atgEvent,
                    function (err,doc) {
                        associate(err,doc, relationshipIds)
                    }
                );
            }

            return result;

        },
        saveOof : function (atgEvent) {
            check(atgEvent, Object);
            // check that user is logged in
            if (! Meteor.userId()) {
                throw new Meteor.Error("cannot save Event for not logged in user");
            }

            validateAtgEventDetails(atgEvent);

            if ("_id" in atgEvent){
                if (Meteor.userId() != atgEvents.findOne({ _id : atgEvent._id}).createdBy ) {
                    throw new Meteor.Error("cannot edit other user's event");
                }
                // dry this
                atgEvents.update(
                    {_id : atgEvent._id},
                    { $set : {
                        eventDetails: atgEvent.eventDetails,
                        startDate: atgEvent.startDate,
                        endDate: atgEvent.endDate
                    }
                    }
                );
            } else {
                atgEvents.insert(atgEvent);
            }

            return atgEvent;

        },
        upsertPl : function(atgEvent, relationshipIds) {
            check(atgEvent,Object);
            check(relationshipIds, {
                productId: String
            });

            // check that user is logged in
            if (! Meteor.userId()) {
                throw new Meteor.Error("cannot save Event for not logged in user");
            }

            // validation of productId
            var product = products.findOne({_id : relationshipIds.productId});
            if (!product) {
                throw new Meteor.Error("Cannot save event, invalid product");
            }

            validateAtgEventDetails(atgEvent);

            // additional dates validations

            if (moment.duration(moment(atgEvent.endDate).diff(moment(atgEvent.startDate))).asHours() > 24 ) {
                throw new Meteor.Error("Invalid dates - product launch is a day event");
            }

            // save event

            if ("_id" in atgEvent) {
                if (Meteor.userId() != atgEvents.findOne({ _id : atgEvent._id}).createdBy) {
                    throw new Meteor.Error("cannot edit other user's event");
                }
                atgEvents.update(
                    {_id : atgEvent._id},
                    { $set : {
                        eventDetails: atgEvent.eventDetails,
                        startDate: atgEvent.startDate,
                        endDate: atgEvent.endDate
                    }
                    }
                );

                // todo most of this is bolier plate code, dry this out!!
                products.update(
                    { events : atgEvent._id},
                    { $pull : { events : atgEvent._id} },
                    {validate : false},
                    function () {
                        associateProduct(undefined, atgEvent._id, relationshipIds.productId);
                    }
                );

            } else {
                atgEvents.insert(atgEvent, function (err, doc) {
                    associateProduct(err, doc, relationshipIds.productId);
                });
            }
            return atgEvent;
        },
        removeAtgEvent : function (id) {
            check(id, String);
            if (! Meteor.userId()) {
                throw new Meteor.Error("cannot remove Event for not logged in user");
            }
            var doc = atgEvents.findOne(id);
            if (!doc) {
                throw new Meteor.Error("cannot find event " + id);
            }
            if (Meteor.userId() != doc.createdBy) {
                throw new Meteor.Error("cannot remove other user's event");
            }

            atgEvents.remove(id);
            // remove associations as well.
            partners.update(
                { events : id},
                { $pull : { events : id} },
                {validate : false}
            );
            products.update(
                { events : id},
                { $pull : { events : id} },
                {validate : false}
            );
            return "event " + id + " removed";
        }
    });


    // helpers
    // callback to update partner and product with the new event

    function associate (err, doc, referenceIds) {
        if (err) {
            throw new Meteor.Error("Error in inserting document ", err)
        }
        associatePartner(err, doc, referenceIds.partnerId);
        associateProduct(err, doc, referenceIds.productId);
    }


    function associateProduct (err, eventId, productId) {
        if (err) {
            throw new Meteor.Error("Error in inserting document ", err)
        }
        products.update({ _id : productId}, { $push : {events : eventId} }, {validate: false});
    }

    function associatePartner (err, eventId, partnerId) {
        if (err) {
            throw new Meteor.Error("Error in inserting document ", err)
        }
        partners.update({_id : partnerId}, { $push: {events : eventId}}, {validate: false});
    }

    function validateAtgEventDetails(atgEvent) {
        // validation against type schema
        var eventType = atgEventTypes.findOne({_id : atgEvent.atgEventTypeId});
        var json = JSON.parse(decodeURIComponent(eventType.eventSchema));
        evalObjectTypes(json);
        var schema = new SimpleSchema(json);
        var schemaContext = schema.newContext();

        if (!schemaContext.validate(atgEvent.eventDetails)) {
            console.log("Cannot save Event - validation error : ", JSON.stringify(schemaContext._invalidKeys));
            throw  new Meteor.Error("Cannot save Event - validation error. ", JSON.stringify(schemaContext._invalidKeys));
        }
        if (moment(atgEvent.startDate).isAfter(moment(atgEvent.endDate))) {
            throw new Meteor.Error("Invalid dates");
        }
    }

    // shamelessly taken from https://github.com/aldeed/meteor-autoform/issues/663
    function evalObjectTypes(obj) {
        for (var k in obj) {
            if (typeof obj[k] == "object" && obj[k] !== null) {
                evalObjectTypes(obj[k]);
            } else {
                if (k === 'type') {
                    try {
                        var val = eval(obj[k]);
                        obj[k] = val;
                    } catch (e) {
                        obj[k] = obj[k];
                    }
                }
            }
        }
    }
}