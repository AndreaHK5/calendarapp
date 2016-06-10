if (Meteor.isClient) {
    upsertProduct = function (product, next) {
        check(product, Object);
        Meteor.call("upsertProduct", product, next);
    };
    deleteProduct = function (id) {
        check(id, String);
        Meteor.call("deleteProduct", id, next);
    }
}

if (Meteor.isServer) {
    Meteor.methods({
        upsertProduct: function (product) {
            check(product, Object);
            // check that user is logged in
            if (!Meteor.userId()) {
                throw new Meteor.Error("Cannot save product for user not logged in");
            }

            // validate team, develpers and publisher
            product.developers.forEach(function (id) {
                if (!partners.findOne({ _id: id })) {
                    throw new Meteor.Error("invalid developer");
                }
            });

            product.publishers.forEach(function (id) {
                if (!partners.findOne({ _id: id })) {
                    throw new Meteor.Error("invalid publisher");
                }
            });

            // team is optional, but shoudl be of people ids.
            if ("team" in product && product.team.length > 0) {
                product.team.forEach(function (id) {
                    if (!people.findOne({ _id: id })) {
                        throw new Meteor.Error("invalid team");
                    }
                });
            }

            var result;
            if ("_id" in product) {
                // not want to update element by element, therefore the object is first validated entierly, then upserted
                var id = product._id;
                delete product._id;
                var schemaContext = Schema.product.newContext();
                if (!schemaContext.validate(product)) {
                    throw new Meteor.Error("Cannot save product - validation error. ", JSON.stringify(schemaContext._invalidKeys));
                }
                result = products.update(
                    { _id: id },
                    product,
                    { validate: false }
                )
            } else {
                // in the insert the object is validated automatically
                result = products.insert(product);
            }

            return result;
        },
        deleteProduct: function (id) {
            check(id, String);
            if (!Meteor.userId()) {
                throw new Meteor.Error("User not logged in");
            }
            products.remove(id);
        }
    })
}