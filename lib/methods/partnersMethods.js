if (Meteor.isClient) {
    upsertPartner = function (partner, next) {
        check(partner, Object);
        Meteor.call("upsertPartner", partner, next);
    };
    deletePartner = function (id) {
        check(id,String);
        Meteor.call("deletePartner",id,next);
    }
}

if (Meteor.isServer) {
    Meteor.methods({
        upsertPartner : function (partner) {
            check(partner, Object);
            // check that user is logged in
            if (! Meteor.userId()) {
                throw new Meteor.Error("User not logged in");
            }

            var result;
            if ("_id" in partner) {
                // not want to update element by element, therefore the object is first validated entierly, then upserted
                var id = partner._id;
                // these fields are autmoatic and therefore cannot be validated
                delete partner._id;
                delete partner.createdAt;
                delete partner.createdBy;
                var schemaContext = Schema.partner.newContext();
                if(!schemaContext.validate(partner)) {
                    throw  new Meteor.Error("Cannot save - validation error. ", JSON.stringify(schemaContext._invalidKeys));
                }
                result = partners.update(
                    {_id : id},
                    partner,
                    {validate : false}
                )
            } else {
                // in the insert the object is validated automatically
                result = partners.insert(partner);
            }

            return result;
        },
        deletePartner : function(id) {
            check(id,String);
            if (! Meteor.userId()) {
                throw new Meteor.Error("User not logged in");
            }
            partners.remove(id);
        }
    })
}